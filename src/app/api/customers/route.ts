import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import { customerInputSchema } from "@/lib/invoice-schema";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeSearch(value: string | null) {
  return value?.trim().slice(0, 120) ?? "";
}

export async function GET(request: Request) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;

  const params = new URL(request.url).searchParams;
  const query = normalizeSearch(params.get("query"));
  const limit = Math.min(
    Math.max(Number(params.get("limit") ?? "12") || 12, 1),
    50,
  );

  try {
    const prisma = getPrisma();
    const rows = await prisma.customer.findMany({
      where: {
        deletedAt: null,
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { phone: { contains: query, mode: "insensitive" } },
                { companyName: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        billingAddress: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    });
    return NextResponse.json({ ok: true, rows });
  } catch (e) {
    console.error("[api/customers] GET failed", e);
    return NextResponse.json(
      { error: "Could not load customers." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = customerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid customer data.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const prisma = getPrisma();
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        companyName: data.companyName || null,
        taxId: data.taxId || null,
        billingAddress: data.billingAddress || null,
        city: data.city || null,
        state: data.state || null,
        postalCode: data.postalCode || null,
        country: data.country || null,
        notes: data.notes || null,
      },
    });
    return NextResponse.json({ ok: true, customer }, { status: 201 });
  } catch (e) {
    console.error("[api/customers] POST failed", e);
    return NextResponse.json(
      { error: "Could not create customer." },
      { status: 500 },
    );
  }
}
