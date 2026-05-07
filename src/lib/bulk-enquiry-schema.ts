import { z } from "zod";

/** Shared client + API validation for `/bulk-orders` lead form. */
export type BulkEnquiryFormValues = z.infer<typeof bulkEnquiryFormSchema>;

export const bulkEnquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Name is too long."),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v.replace(/\D/g, "").length >= 8,
      "Please enter a valid phone number.",
    )
    .max(22, "Phone number is too long."),
  email: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email or leave blank."),
  ]),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  businessType: z.string().trim().max(80).optional().or(z.literal("")),
  approxGrams: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us what you need (at least 10 characters).")
    .max(5000, "Message is too long."),
});

/** Client + API body (no honeypot — hidden fields caused false positives with password managers). */
export const bulkLeadFormClientSchema = bulkEnquiryFormSchema;

export type BulkLeadFormClientValues = z.infer<typeof bulkLeadFormClientSchema>;
