/**
 * Send a WhatsApp template message to the exported contact list via Meta's
 * official WhatsApp Cloud API.
 *
 *   pnpm tsx scripts/send-whatsapp.ts --file exports/order-contacts-paid-2026-08-08.csv
 *      → DRY RUN by default. Prints exactly what would be sent, sends nothing.
 *
 *   pnpm tsx scripts/send-whatsapp.ts --file <csv> --template freedom_sale_2026 --send
 *      → actually sends.
 *
 * ── Required env (get these from developers.facebook.com → your WhatsApp app) ──
 *   WHATSAPP_PHONE_NUMBER_ID   numeric id of your sending number
 *   WHATSAPP_ACCESS_TOKEN      permanent System User token, not the 24h test one
 *   WHATSAPP_TEMPLATE_LANG     optional, defaults to en
 *
 * ── Why a template and not free text ──
 * Outside a 24-hour customer-service window you may only send a message that
 * Meta has pre-approved as a template. Free text to a cold contact is rejected
 * by the API — this is not a rate limit you can work around, it is the model.
 * Templates are submitted in WhatsApp Manager and usually approved within a day.
 *
 * ── Consent ──
 * Meta requires opt-in before you send a marketing template, and India's DPDP
 * Act requires consent for using a delivery phone number for marketing. This
 * script does not check that for you. Only run it against a list you can show
 * consent for.
 */

import { readFileSync } from "node:fs";
import "dotenv/config";

const args = process.argv.slice(2);
const argVal = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const file = argVal("file");
const template = argVal("template") ?? "hello_world";
const lang = process.env.WHATSAPP_TEMPLATE_LANG ?? "en";
const live = args.includes("--send");
/** Meta's docs put sustained throughput well above this; 1/sec is polite. */
const DELAY_MS = Number(argVal("delay") ?? 1000);

type Row = Record<string, string>;

function parseCsv(text: string): Row[] {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    // Handles the quoted-cell form this repo's exporter writes.
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (c === '"') inQ = false;
        else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ",") {
        cells.push(cur);
        cur = "";
      } else cur += c;
    }
    cells.push(cur);
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""]));
  });
}

async function sendOne(to: string, name: string) {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  const body = {
    messaging_product: "whatsapp",
    to: to.replace("+", ""),
    type: "template",
    template: {
      name: template,
      language: { code: lang },
      // Body variables, in order. Adjust to match the template you registered.
      components: [
        { type: "body", parameters: [{ type: "text", text: name }] },
      ],
    },
  };

  const res = await fetch(`https://graph.facebook.com/v21.0/${id}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const err = json.error as { message?: string; code?: number } | undefined;
    throw new Error(`${res.status} ${err?.message ?? JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  if (!file) throw new Error("Pass --file exports/<your-export>.csv");

  const rows = parseCsv(readFileSync(file, "utf8"));
  const targets = rows.filter((r) => r.phone_e164?.startsWith("+"));
  const skipped = rows.length - targets.length;

  console.log(`\n  Template : ${template} (${lang})`);
  console.log(
    `  Contacts : ${targets.length} sendable, ${skipped} skipped (no valid E.164)`,
  );
  console.log(
    `  Mode     : ${live ? "LIVE — messages will be sent" : "DRY RUN — nothing will be sent"}\n`,
  );

  if (live) {
    for (const v of ["WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN"]) {
      if (!process.env[v]) throw new Error(`${v} is not set — cannot send.`);
    }
  }

  let ok = 0;
  let failed = 0;

  for (const [i, r] of targets.entries()) {
    const label = `${String(i + 1).padStart(3)}/${targets.length}  ${r.phone_e164}  ${r.name}`;
    if (!live) {
      console.log(`  [dry] ${label}`);
      continue;
    }
    try {
      await sendOne(r.phone_e164, r.name?.split(" ")[0] || "there");
      ok++;
      console.log(`  [ok ] ${label}`);
    } catch (e) {
      failed++;
      console.log(`  [ERR] ${label} — ${e instanceof Error ? e.message : e}`);
    }
    if (i < targets.length - 1)
      await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  if (live) console.log(`\n  Sent ${ok}, failed ${failed}.`);
  else console.log(`\n  Dry run complete. Re-run with --send to deliver.`);
}

main().catch((e) => {
  console.error(`\n  ${e instanceof Error ? e.message : e}\n`);
  process.exit(1);
});
