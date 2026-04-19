import { z } from "zod";
import {
  HEARD_ABOUT_CHANNELS,
  isValidHearAboutChannel,
} from "@/data/heard-about-channels";

export type CheckoutFormValues = {
  name: string;
  phone: string;
  email: string;
  pincode: string;
  heardAboutUs: string;
  notes: string;
};

export const checkoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters)."),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v.replace(/\D/g, "").length >= 10,
      "Please enter a valid phone number (at least 10 digits).",
    ),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Enter a valid email address."),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code."),
  heardAboutUs: z
    .string()
    .refine(
      (s) => s === "" || isValidHearAboutChannel(s),
      `Pick one of the ${HEARD_ABOUT_CHANNELS.length} options or leave blank.`,
    ),
  notes: z.string().trim(),
});
