import path from "node:path";
import type { Invoice, InvoiceLineItem } from "@prisma/client";
import PDFDocument from "pdfkit";
import { SITE_CONFIG } from "@/lib/constants";

const FONTS_DIR = path.join(process.cwd(), "src/assets/fonts/order-pdf");
const FONT_DISPLAY = path.join(FONTS_DIR, "BricolageGrotesque-Variable.ttf");
const FONT_BODY = path.join(FONTS_DIR, "Figtree-Variable.ttf");

const MARGIN = 52;
const COLORS = {
  ink: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  faint: "#94a3b8",
  rule: "#e2e8f0",
  primary: "#b45309",
} as const;

type InvoiceWithItems = Invoice & { lineItems: InvoiceLineItem[] };
type PdfDoc = InstanceType<typeof PDFDocument>;

function cleanText(str: string | null | undefined): string {
  if (!str) return "";
  return str.replace(/[\u200e\u200f\u200b-\u200d\ufeff\u202a-\u202e]/g, "");
}

function formatMoney(amountPaise: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountPaise / 100);
}

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

export function buildInvoicePdfBuffer(
  invoice: InvoiceWithItems,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: MARGIN,
      info: { Title: `Invoice ${invoice.invoiceNumber}` },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const left = MARGIN;
    const right = doc.page.width - MARGIN;
    const width = right - left;
    const descW = width * 0.52;
    const qtyW = width * 0.12;
    const unitW = width * 0.16;
    const amountW = width * 0.2;
    const colQty = left + descW;
    const colUnit = colQty + qtyW;
    const colAmount = colUnit + unitW;

    doc
      .font(FONT_DISPLAY)
      .fontSize(24)
      .fillColor(COLORS.ink)
      .text("Invoice", left, doc.y, { width: width / 2 });

    const logoPath = path.join(process.cwd(), "public/logo-horizon.png");
    doc.image(logoPath, right - 120, 48, { width: 120 });

    doc
      .font(FONT_BODY)
      .fontSize(8.5)
      .fillColor(COLORS.faint)
      .text(SITE_CONFIG.url, left, 74, {
        align: "right",
        width,
        link: SITE_CONFIG.url,
        underline: true,
      });

    doc.y = 90;
    drawRule(doc, doc.y, left, right);
    doc.moveDown(0.65);

    const issue = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(invoice.issueDate);
    const due = invoice.dueDate
      ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
          invoice.dueDate,
        )
      : "—";

    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
    doc.text(`Invoice No: ${cleanText(invoice.invoiceNumber)}`, left, doc.y, {
      width: width / 2,
    });
    doc.text(`Status: ${invoice.status}`, left, doc.y + 1, {
      width: width / 2,
    });
    doc.text(`Issue Date: ${issue}`, left, doc.y + 1, { width: width / 2 });
    doc.text(`Due Date: ${due}`, left, doc.y + 1, { width: width / 2 });

    const billY = doc.y - 57;
    doc
      .font(FONT_DISPLAY)
      .fontSize(11.5)
      .fillColor(COLORS.ink)
      .text("Bill To", left + width * 0.55, billY, { width: width * 0.45 });
    doc
      .font(FONT_BODY)
      .fontSize(10)
      .fillColor(COLORS.body)
      .text(cleanText(invoice.customerName), left + width * 0.55, billY + 16, {
        width: width * 0.45,
      });
    if (invoice.customerCompanyName) {
      doc.text(cleanText(invoice.customerCompanyName), { width: width * 0.45 });
    }
    if (invoice.customerEmail) {
      doc.text(cleanText(invoice.customerEmail), { width: width * 0.45 });
    }
    if (invoice.customerPhone) {
      doc.text(cleanText(invoice.customerPhone), { width: width * 0.45 });
    }
    const addressBits = [
      invoice.billingAddress,
      invoice.billingCity,
      invoice.billingState,
      invoice.billingPostalCode,
      invoice.billingCountry,
    ]
      .map(cleanText)
      .filter(Boolean);
    if (addressBits.length > 0) {
      doc.moveDown(0.2);
      doc.text(addressBits.join(", "), { width: width * 0.45 });
    }

    doc.moveDown(1.2);
    drawRule(doc, doc.y, left, right);
    doc.moveDown(0.5);
    doc.font(FONT_BODY).fontSize(8.5).fillColor(COLORS.muted);
    doc.text("Description", left, doc.y, { width: descW - 4 });
    doc.text("Qty", colQty, doc.y, { width: qtyW - 4, align: "right" });
    doc.text("Unit", colUnit, doc.y, { width: unitW - 4, align: "right" });
    doc.text("Amount", colAmount, doc.y, { width: amountW, align: "right" });
    doc.moveDown(0.45);
    drawRule(doc, doc.y, left, right);
    doc.moveDown(0.45);

    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
    for (const line of invoice.lineItems.sort(
      (a, b) => a.sortOrder - b.sortOrder,
    )) {
      const amount = formatMoney(line.lineTotalPaise, invoice.currency);
      const lineStart = doc.y;
      doc.text(cleanText(line.description), left, lineStart, {
        width: descW - 4,
      });
      doc.text(String(line.quantity), colQty, lineStart, {
        width: qtyW - 4,
        align: "right",
      });
      doc.text(
        formatMoney(line.unitPricePaise, invoice.currency),
        colUnit,
        lineStart,
        {
          width: unitW - 4,
          align: "right",
        },
      );
      doc.text(amount, colAmount, lineStart, {
        width: amountW,
        align: "right",
      });
      doc.y = Math.max(doc.y, lineStart + 18);
    }

    doc.moveDown(0.8);
    drawRule(doc, doc.y, left, right);
    doc.moveDown(0.7);
    const totalsX = left + width * 0.55;
    const totalsW = width * 0.45;
    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
    doc.text("Subtotal", totalsX, doc.y, { width: totalsW * 0.55 });
    doc.text(
      formatMoney(invoice.subtotalPaise, invoice.currency),
      totalsX,
      doc.y,
      {
        width: totalsW,
        align: "right",
      },
    );
    if (invoice.taxTotalPaise > 0) {
      doc.text("Tax", totalsX, doc.y + 4, { width: totalsW * 0.55 });
      doc.text(
        formatMoney(invoice.taxTotalPaise, invoice.currency),
        totalsX,
        doc.y,
        {
          width: totalsW,
          align: "right",
        },
      );
    }
    if (invoice.discountTotalPaise > 0) {
      doc.text("Discount", totalsX, doc.y + 4, { width: totalsW * 0.55 });
      doc.text(
        `- ${formatMoney(invoice.discountTotalPaise, invoice.currency)}`,
        totalsX,
        doc.y,
        {
          width: totalsW,
          align: "right",
        },
      );
    }

    drawRule(doc, doc.y + 16, totalsX, right);
    doc
      .font(FONT_DISPLAY)
      .fontSize(13)
      .fillColor(COLORS.primary)
      .text("Total", totalsX, doc.y + 24, { width: totalsW * 0.55 });
    doc
      .font(FONT_DISPLAY)
      .fontSize(14)
      .fillColor(COLORS.ink)
      .text(formatMoney(invoice.totalPaise, invoice.currency), totalsX, doc.y, {
        width: totalsW,
        align: "right",
      });

    doc.moveDown(1.25);
    if (invoice.paymentTerms) {
      doc
        .font(FONT_DISPLAY)
        .fontSize(11)
        .fillColor(COLORS.ink)
        .text("Payment Terms", left, doc.y, { width });
      doc.moveDown(0.2);
      doc
        .font(FONT_BODY)
        .fontSize(9.5)
        .fillColor(COLORS.body)
        .text(cleanText(invoice.paymentTerms), {
          width,
        });
      doc.moveDown(0.4);
    }
    if (invoice.notes) {
      doc
        .font(FONT_DISPLAY)
        .fontSize(11)
        .fillColor(COLORS.ink)
        .text("Notes", left, doc.y, { width });
      doc.moveDown(0.2);
      doc
        .font(FONT_BODY)
        .fontSize(9.5)
        .fillColor(COLORS.body)
        .text(cleanText(invoice.notes), { width });
    }

    doc.moveDown(1);
    doc
      .font(FONT_BODY)
      .fontSize(8)
      .fillColor(COLORS.faint)
      .text("This is a system-generated invoice document.", {
        width,
      });
    doc.end();
  });
}
