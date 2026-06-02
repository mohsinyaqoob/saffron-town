import { InvoiceStatus } from "@prisma/client";
import { z } from "zod";

const moneyInPaise = z
  .number({ error: "Enter a valid amount." })
  .int("Amount must be a whole number in paise.")
  .min(0, "Amount cannot be negative.");

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const dateString = z
  .string()
  .trim()
  .min(1, "Date is required.")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date.");

export const customerInputSchema = z.object({
  name: z.string().trim().min(2, "Customer name is required.").max(120),
  email: optionalText(254).refine(
    (v) => !v || z.email().safeParse(v).success,
    "Enter a valid email address.",
  ),
  phone: optionalText(22),
  companyName: optionalText(160),
  taxId: optionalText(80),
  billingAddress: optionalText(2000),
  city: optionalText(100),
  state: optionalText(100),
  postalCode: optionalText(30),
  country: optionalText(100),
  notes: optionalText(2000),
});

export const invoiceLineItemInputSchema = z.object({
  id: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description is required.").max(300),
  quantity: z
    .number({ error: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
  unitPricePaise: moneyInPaise,
  taxRatePercent: z
    .number({ error: "Tax rate is required." })
    .int("Tax rate must be a whole number.")
    .min(0, "Tax rate cannot be negative.")
    .max(100, "Tax rate cannot exceed 100."),
  discountPaise: moneyInPaise,
});

export const invoiceCreateInputSchema = z
  .object({
    invoiceNumber: z.string().trim().min(1).max(64),
    status: z.nativeEnum(InvoiceStatus),
    issueDate: dateString,
    dueDate: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date."),
    currency: z.string().trim().min(3).max(8),
    customerId: z.string().trim().min(1, "Choose a customer."),
    notes: optionalText(4000),
    paymentTerms: optionalText(2000),
    lineItems: z
      .array(invoiceLineItemInputSchema)
      .min(1, "Add at least one line item."),
  })
  .superRefine((value, ctx) => {
    const subtotalPaise = value.lineItems.reduce(
      (sum, line) => sum + line.quantity * line.unitPricePaise,
      0,
    );
    const discountPaise = value.lineItems.reduce(
      (sum, line) => sum + line.discountPaise,
      0,
    );
    if (discountPaise > subtotalPaise) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discount cannot exceed subtotal.",
        path: ["lineItems"],
      });
    }
  });

export const invoiceListQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  status: z
    .union([z.literal("ALL"), z.nativeEnum(InvoiceStatus)])
    .optional()
    .default("ALL"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
  sortBy: z
    .enum(["createdAt", "issueDate", "dueDate", "invoiceNumber", "totalPaise"])
    .default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type CustomerInput = z.infer<typeof customerInputSchema>;
export type InvoiceCreateInput = z.infer<typeof invoiceCreateInputSchema>;
export type InvoiceLineItemInput = z.infer<typeof invoiceLineItemInputSchema>;
export type InvoiceListQueryInput = z.infer<typeof invoiceListQuerySchema>;
