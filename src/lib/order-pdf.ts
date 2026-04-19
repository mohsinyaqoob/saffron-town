import PDFDocument from "pdfkit";
import { SITE_CONFIG } from "@/lib/constants";
import type { OrderWithItems } from "@/lib/order-receipt";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}

export function buildOrderPdfBuffer(order: OrderWithItems): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).fillColor("#1a1a1a").text(SITE_CONFIG.name);
    doc.moveDown(0.25);
    doc.fontSize(11).fillColor("#555").text("Order summary / bill");
    doc.moveDown(1);

    doc.fontSize(10).fillColor("#333");
    doc.text(`Order number: ${order.id}`);
    doc.text(`Placed: ${formatDate(order.createdAt)}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown(1);

    doc.fontSize(12).fillColor("#111").text("Bill to", { underline: true });
    doc.moveDown(0.35);
    doc.fontSize(10).fillColor("#333");
    doc.text(order.customerName);
    doc.text(order.email);
    doc.text(order.phone);
    doc.text(`PIN ${order.pincode}`);
    if (order.notes) {
      doc.moveDown(0.35);
      doc.text(`Notes: ${order.notes}`);
    }
    doc.moveDown(1);

    doc.fontSize(12).fillColor("#111").text("Line items", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#222");

    for (const line of order.items) {
      doc.text(
        `${line.productName} (${line.variantLabel}) — Qty ${line.quantity}`,
      );
      doc.text(
        `  ${formatMoney(line.unitPriceRupees, order.currency)} each → ${formatMoney(line.lineTotalRupees, order.currency)}`,
        { indent: 12 },
      );
      doc.moveDown(0.35);
    }

    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#111");
    doc.text(
      `Total (${order.currency}): ${formatMoney(order.subtotalRupees, order.currency)}`,
    );
    doc.moveDown(0.5);
    doc
      .fontSize(9)
      .fillColor("#555")
      .text(
        "Shipping and payment details are confirmed separately by our team.",
      );
    doc.moveDown(1.2);

    doc
      .fontSize(8)
      .fillColor("#888")
      .text(
        "This document is a summary for your records. It is not a tax invoice.",
      );
    doc.text(SITE_CONFIG.url, { link: SITE_CONFIG.url });

    doc.end();
  });
}
