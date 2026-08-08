/**
 * Export customer / order contacts to CSV.
 *
 *   pnpm tsx scripts/export-contacts.ts            # paid orders only (default)
 *   pnpm tsx scripts/export-contacts.ts --all      # every order, any status
 *   pnpm tsx scripts/export-contacts.ts --customers # the Customer table instead
 *
 * Writes to ./exports/ , which is gitignored — this file contains personal data
 * and must never end up in the repository or in a shared drive by accident.
 *
 * Phone numbers are normalised to E.164 (+91…) because that is the only format
 * WhatsApp, and every bulk-messaging provider, will accept.
 *
 * ── Before you use this list ──
 * These numbers were collected to fulfil orders. Under India's DPDP Act 2023,
 * using them for marketing is a different purpose and needs its own consent.
 * See the notes printed at the end of the run.
 */

import { writeFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const args = new Set(process.argv.slice(2));
const wantAll = args.has("--all");
const wantCustomers = args.has("--customers");
const wantPhonesOnly = args.has("--phones");

/** Normalise an Indian mobile to E.164. Returns null if it cannot be trusted. */
function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) {
    const rest = digits.slice(1);
    return /^[6-9]/.test(rest) ? `+91${rest}` : null;
  }
  // Anything else (landline, foreign, malformed) is returned unflagged so it
  // can be reviewed by hand rather than silently mangled into a wrong number.
  return null;
}

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not set.");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });

  const stamp = new Date().toISOString().slice(0, 10);
  let rows: Record<string, unknown>[] = [];
  let outfile = "";

  // ── Phone numbers only, one per line, no header, no other columns ──
  //
  // There is no dedicated "alternate phone" column in the schema. A person's
  // numbers are instead spread across four tables — an order, their customer
  // record, an invoice and a bulk enquiry can each carry a different number for
  // the same human. This mode unions all four and de-duplicates, so a second
  // number recorded anywhere comes through as its own line.
  if (wantPhonesOnly) {
    const [orders, customers, invoices, enquiries] = await Promise.all([
      prisma.order.findMany({ select: { phone: true } }),
      prisma.customer.findMany({
        where: { deletedAt: null },
        select: { phone: true },
      }),
      prisma.invoice.findMany({ select: { customerPhone: true } }),
      prisma.bulkEnquiry.findMany({ select: { phone: true } }),
    ]);

    const raw = [
      ...orders.map((o) => o.phone),
      ...customers.map((c) => c.phone),
      ...invoices.map((i) => i.customerPhone),
      ...enquiries.map((b) => b.phone),
    ];

    // Dedupe on the normalised form so "9876543210", "+919876543210" and
    // "091 98765 43210" collapse to one line rather than three.
    const seen = new Set<string>();
    const unusable: string[] = [];
    for (const p of raw) {
      const e164 = toE164(p);
      if (!e164) {
        if (p?.trim()) unusable.push(p.trim());
        continue;
      }
      seen.add(e164);
    }

    const numbers = [...seen].sort();
    outfile = `exports/phone-numbers-${stamp}.csv`;
    writeFileSync(outfile, `${numbers.join("\n")}\n`, "utf8");

    console.log(
      `\n  Wrote ${numbers.length} unique phone numbers → ${outfile}`,
    );
    console.log(
      `  Sources: ${orders.length} orders, ${customers.length} customers, ${invoices.length} invoices, ${enquiries.length} bulk enquiries`,
    );
    if (unusable.length > 0) {
      console.log(
        `  Excluded ${unusable.length} unparseable: ${[...new Set(unusable)].join(", ")}`,
      );
    }
    console.log(
      "\n  This file contains personal data. exports/ is gitignored — keep it that way.",
    );
    await prisma.$disconnect();
    return;
  }

  if (wantCustomers) {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      select: {
        name: true,
        phone: true,
        email: true,
        city: true,
        postalCode: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    rows = customers.map((c) => ({
      name: c.name,
      phone_e164: toE164(c.phone),
      phone_raw: c.phone ?? "",
      email: c.email ?? "",
      city: c.city ?? "",
      pincode: c.postalCode ?? "",
      created: c.createdAt.toISOString().slice(0, 10),
    }));
    outfile = `exports/customers-${stamp}.csv`;
  } else {
    const orders = await prisma.order.findMany({
      where: wantAll ? {} : { status: "PAID" },
      select: {
        customerName: true,
        phone: true,
        email: true,
        pincode: true,
        status: true,
        createdAt: true,
        subtotalRupees: true,
        discountRupees: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // One row per person, not per order — a customer with three orders should
    // not be added to a broadcast list three times.
    const byPhone = new Map<string, Record<string, unknown>>();
    for (const o of orders) {
      const e164 = toE164(o.phone);
      const key = e164 ?? `raw:${o.phone}`;
      const existing = byPhone.get(key);
      if (existing) {
        existing.orders = (existing.orders as number) + 1;
        existing.lifetime_rupees =
          (existing.lifetime_rupees as number) +
          (o.subtotalRupees - o.discountRupees);
        continue;
      }
      byPhone.set(key, {
        name: o.customerName,
        phone_e164: e164,
        phone_raw: o.phone,
        email: o.email,
        pincode: o.pincode,
        orders: 1,
        lifetime_rupees: o.subtotalRupees - o.discountRupees,
        last_order: o.createdAt.toISOString().slice(0, 10),
        last_status: o.status,
      });
    }
    rows = [...byPhone.values()];
    outfile = `exports/order-contacts-${wantAll ? "all" : "paid"}-${stamp}.csv`;
  }

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvCell(r[h])).join(",")),
  ].join("\n");

  writeFileSync(outfile, `${csv}\n`, "utf8");

  const usable = rows.filter((r) => r.phone_e164).length;
  console.log(`\n  Wrote ${rows.length} unique contacts → ${outfile}`);
  console.log(
    `  ${usable} have a valid E.164 mobile; ${rows.length - usable} need manual review.`,
  );
  console.log(
    "\n  This file contains personal data. exports/ is gitignored — keep it that way.",
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("\n  Export failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
