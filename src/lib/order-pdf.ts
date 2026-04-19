import path from "node:path";
import PDFDocument from "pdfkit";
import { SITE_CONFIG } from "@/lib/constants";
import type { OrderWithItems } from "@/lib/order-receipt";

const FONTS_DIR = path.join(process.cwd(), "src/assets/fonts/order-pdf");
const FONT_DISPLAY = path.join(FONTS_DIR, "BricolageGrotesque-Variable.ttf");
const FONT_BODY = path.join(FONTS_DIR, "Figtree-Variable.ttf");

const MARGIN = 52;
const FOOTER_RESERVE = 108;
const COLORS = {
  ink: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  faint: "#94a3b8",
  rule: "#e2e8f0",
} as const;

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

type PdfDoc = InstanceType<typeof PDFDocument>;

function drawRule(doc: PdfDoc, y: number, left: number, right: number) {
  doc.save();
  doc
    .strokeColor(COLORS.rule)
    .lineWidth(0.75)
    .moveTo(left, y)
    .lineTo(right, y)
    .stroke();
  doc.restore();
}

export function buildOrderPdfBuffer(order: OrderWithItems): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: MARGIN,
      info: { Title: `Order ${order.id}` },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const innerLeft = MARGIN;
    const innerRight = pageW - MARGIN;
    const innerW = innerRight - innerLeft;

    const colQty = innerLeft + innerW * 0.58;
    const colAmt = innerLeft + innerW * 0.72;
    const descW = colQty - innerLeft - 10;
    const qtyW = colAmt - colQty - 10;
    const amtW = innerRight - colAmt;

    const needsRoom = (minY: number) => {
      if (doc.y + minY <= pageH - MARGIN - FOOTER_RESERVE) return;
      doc.addPage();
      doc.font(FONT_BODY).fillColor(COLORS.body);
    };

    doc
      .font(FONT_DISPLAY)
      .fontSize(22)
      .fillColor(COLORS.ink)
      .text(SITE_CONFIG.name, {
        width: innerW,
      });
    doc.moveDown(0.15);
    doc
      .font(FONT_BODY)
      .fontSize(10.5)
      .fillColor(COLORS.muted)
      .text("Order summary", {
        width: innerW,
      });
    doc.moveDown(0.85);
    drawRule(doc, doc.y, innerLeft, innerRight);
    doc.moveDown(0.65);

    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
    doc.text(`Order number  ${order.id}`, { width: innerW });
    doc.text(`Placed  ${formatDate(order.createdAt)}`, { width: innerW });
    doc.text(`Status  ${order.status}`, { width: innerW });
    doc.moveDown(1.1);

    doc
      .font(FONT_DISPLAY)
      .fontSize(12.5)
      .fillColor(COLORS.ink)
      .text("Bill to", { width: innerW });
    doc.moveDown(0.4);
    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
    doc.text(order.customerName, { width: innerW });
    doc.text(order.email, { width: innerW });
    doc.text(order.phone, { width: innerW });
    doc.text(`PIN ${order.pincode}`, { width: innerW });
    if (order.notes) {
      doc.moveDown(0.35);
      doc
        .font(FONT_BODY)
        .fontSize(10)
        .fillColor(COLORS.body)
        .text(`Notes  ${order.notes}`, { width: innerW });
    }
    doc.moveDown(1.05);

    doc
      .font(FONT_DISPLAY)
      .fontSize(12.5)
      .fillColor(COLORS.ink)
      .text("Line items", { width: innerW });
    doc.moveDown(0.45);

    doc.font(FONT_BODY).fontSize(8.5).fillColor(COLORS.muted);
    const headerY = doc.y;
    doc.text("Item", innerLeft, headerY, { width: descW });
    doc.text("Qty", colQty, headerY, { width: qtyW, align: "right" });
    doc.text("Amount", colAmt, headerY, { width: amtW, align: "right" });
    doc.y = headerY + doc.currentLineHeight() + 2;
    drawRule(doc, doc.y, innerLeft, innerRight);
    doc.moveDown(0.45);

    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);

    for (const line of order.items) {
      const title = `${line.productName} (${line.variantLabel})`;
      const detail = `${formatMoney(line.unitPriceRupees, order.currency)} each`;
      const amount = formatMoney(line.lineTotalRupees, order.currency);

      const titleH = doc.heightOfString(title, { width: descW });
      const detailH = doc.heightOfString(detail, { width: descW });
      const rowBlockH = titleH + detailH + 2;
      const sideH = Math.max(
        doc.heightOfString(String(line.quantity), {
          width: qtyW,
          align: "right",
        }),
        doc.heightOfString(amount, { width: amtW, align: "right" }),
      );
      const rowH = Math.max(rowBlockH, sideH) + 6;

      needsRoom(rowH + 8);

      const rowTop = doc.y;
      doc.text(title, innerLeft, rowTop, { width: descW });
      doc.fillColor(COLORS.muted);
      doc.text(detail, innerLeft, rowTop + titleH + 1, { width: descW });
      doc.fillColor(COLORS.body);
      doc.text(String(line.quantity), colQty, rowTop, {
        width: qtyW,
        align: "right",
      });
      doc.text(amount, colAmt, rowTop, { width: amtW, align: "right" });
      doc.y = rowTop + rowH;
    }

    doc.moveDown(0.5);
    needsRoom(56);
    drawRule(doc, doc.y, innerLeft, innerRight);
    doc.moveDown(0.55);

    doc
      .font(FONT_DISPLAY)
      .fontSize(13)
      .fillColor(COLORS.ink)
      .text(
        `Total (${order.currency})  ${formatMoney(order.subtotalRupees, order.currency)}`,
        innerLeft,
        doc.y,
        { width: innerW, align: "right" },
      );
    doc.moveDown(0.85);

    doc
      .font(FONT_BODY)
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        "Shipping and payment details are confirmed separately by our team.",
        { width: innerW, align: "left" },
      );
    doc.moveDown(1.1);

    doc
      .font(FONT_BODY)
      .fontSize(8)
      .fillColor(COLORS.faint)
      .text(
        "This document is a summary for your records. It is not a tax invoice.",
        { width: innerW },
      );
    doc.moveDown(0.25);
    doc.fillColor(COLORS.muted).text(SITE_CONFIG.url, {
      width: innerW,
      link: SITE_CONFIG.url,
      underline: true,
    });

    doc.end();
  });
}
