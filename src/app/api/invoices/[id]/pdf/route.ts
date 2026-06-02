import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import { buildInvoicePdfBuffer } from "@/lib/invoice-pdf";
import { getPrisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: Context) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;
  const { id } = await context.params;

  try {
    const invoice = await getPrisma().invoice.findUnique({
      where: { id },
      include: { lineItems: true },
    });
    if (!invoice) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    const pdf = await buildInvoicePdfBuffer(invoice);
    const safeName = `saffron-town-invoice-${invoice.invoiceNumber}.pdf`;
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("[api/invoices/:id/pdf] render failed", e);
    return NextResponse.json(
      { error: "Could not generate PDF." },
      { status: 500 },
    );
  }
}
