import { z } from "zod";
import { WHOLESALE_MIN_GRAMS_LABEL } from "@/lib/wholesale-constants";

/** Legacy quantity buckets below wholesale minimum (no longer accepted). */
const DEPRECATED_QUANTITY_BUCKETS = ["20-50g", "50-100g", "100g-500g"] as const;

/** Shared client + API validation for `/bulk-orders` lead form. */
export type BulkEnquiryFormValues = z.infer<typeof bulkEnquiryFormSchema>;

export const bulkEnquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v.replace(/\D/g, "").length >= 8,
      "Please enter a valid WhatsApp or mobile number.",
    )
    .max(22, "Phone number is too long."),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  businessType: z.string().trim().max(80).optional().or(z.literal("")),
  approxGrams: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) =>
        !v || !(DEPRECATED_QUANTITY_BUCKETS as readonly string[]).includes(v),
      `Minimum wholesale order is ${WHOLESALE_MIN_GRAMS_LABEL}.`,
    ),
  message: z
    .string()
    .trim()
    .max(5000, "Message is too long.")
    .optional()
    .or(z.literal("")),
});

/** Client + API body (no honeypot — hidden fields caused false positives with password managers). */
export const bulkLeadFormClientSchema = bulkEnquiryFormSchema;

export type BulkLeadFormClientValues = z.infer<typeof bulkLeadFormClientSchema>;
