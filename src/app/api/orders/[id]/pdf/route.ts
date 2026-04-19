import { NextResponse } from "next/server";
import { buildOrderPdfBuffer } from "@/lib/order-pdf";
import { getOrderWithReceipt } from "@/lib/order-receipt";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const receipt = new URL(request.url).searchParams.get("receipt") ?? undefined;

  const order = await getOrderWithReceipt(id, receipt);
  if (!order) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const pdf = await buildOrderPdfBuffer(order);
    const safeName = `saffron-town-order-${id.slice(0, 8)}.pdf`;
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("[orders/pdf] render failed", e);
    return NextResponse.json(
      { error: "Could not generate PDF." },
      { status: 500 },
    );
  }
}
