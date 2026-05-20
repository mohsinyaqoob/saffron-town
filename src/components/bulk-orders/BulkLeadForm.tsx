"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  type BulkLeadFormClientValues,
  bulkLeadFormClientSchema,
} from "@/lib/bulk-enquiry-schema";
import { randomBulkEnquiryTatHours } from "@/lib/bulk-enquiry-tat";
import { cn } from "@/lib/utils";
import { WHOLESALE_MIN_GRAMS_LABEL } from "@/lib/wholesale-constants";

const BUSINESS_TYPES = [
  { value: "", label: "Choose your business type" },
  { value: "restaurant", label: "Restaurant / cloud kitchen" },
  { value: "sweet-shop", label: "Mithai / sweet shop" },
  { value: "hotel", label: "Hotel / catering" },
  { value: "retailer", label: "Retail / speciality store" },
  { value: "exporter", label: "Exporter / distributor" },
  { value: "corporate", label: "Corporate gifting" },
  { value: "other", label: "Other" },
] as const;

const QUANTITY_BUCKETS = [
  { value: "", label: "Select approximate quantity" },
  { value: "100-250g", label: "100g – 250g (minimum order)" },
  { value: "250-500g", label: "250g – 500g" },
  { value: "500g+", label: "500g or more" },
  { value: "custom", label: "Larger volume / recurring supply" },
] as const;

const inputBaseClass =
  "mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/30 placeholder:text-text-muted focus:ring-2 border-secondary-border/40";

const fieldErrorClass =
  "border-red-400/80 ring-2 ring-red-200/60 focus:border-red-400 focus:ring-red-200/80";

const defaultValues: BulkLeadFormClientValues = {
  name: "",
  phone: "",
  organization: "",
  businessType: "",
  approxGrams: "",
  message: "",
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4 border-0 p-0">
      <legend className="w-full">
        <span className="font-display text-lg font-semibold text-text-primary">
          {title}
        </span>
        {description ? (
          <p className="mt-1 text-sm text-text-muted font-body leading-relaxed">
            {description}
          </p>
        ) : null}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function FieldLabel({
  htmlFor,
  title,
  hint,
  required,
}: {
  htmlFor?: string;
  title: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <span className="block" id={htmlFor ? `${htmlFor}-label` : undefined}>
      <span className="text-sm font-semibold text-text-primary font-body">
        {title}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-text-muted font-body leading-snug">
          {hint}
        </span>
      ) : null}
    </span>
  );
}

export function BulkLeadForm() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BulkLeadFormClientValues>({
    resolver: zodResolver(bulkLeadFormClientSchema),
    defaultValues,
  });

  async function onSubmit(values: BulkLeadFormClientValues) {
    setSubmitState("loading");
    setSubmitMessage(null);

    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      organization: values.organization?.trim() || "",
      businessType: values.businessType?.trim() || "",
      approxGrams: values.approxGrams?.trim() || "",
      message: values.message?.trim() || "",
    };

    try {
      const res = await fetch("/api/bulk-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (res.ok && data.ok) {
        const tatHours = randomBulkEnquiryTatHours();
        router.push(`/bulk-orders/thank-you?hours=${tatHours}`);
        return;
      }

      setSubmitState("error");
      setSubmitMessage(
        data.message ||
          "Something went wrong. Please call us—our team responds fastest on phone.",
      );
      return;
    } catch {
      setSubmitState("error");
      setSubmitMessage(
        "Network error. Please call or WhatsApp us with your requirement.",
      );
    }
  }

  return (
    <form
      id="bulk-lead-form"
      className="space-y-8"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormSection
        title="Your contact details"
        description="We reply by phone or WhatsApp—no waiting on email threads."
      >
        <label className="sm:col-span-2">
          <FieldLabel
            htmlFor="bulk-name"
            title="Full name"
            hint="As it should appear on your quote or invoice"
            required
          />
          <input
            id="bulk-name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            className={cn(inputBaseClass, errors.name && fieldErrorClass)}
            placeholder="e.g. Rajesh Kumar"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-700 font-body" role="alert">
              {errors.name.message}
            </p>
          )}
        </label>

        <label className="sm:col-span-2">
          <FieldLabel
            htmlFor="bulk-phone"
            title="WhatsApp / mobile number"
            hint="Active number—we usually call or message here first"
            required
          />
          <input
            id="bulk-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={errors.phone ? true : undefined}
            className={cn(inputBaseClass, errors.phone && fieldErrorClass)}
            placeholder="10-digit mobile with country code if outside India"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-700 font-body" role="alert">
              {errors.phone.message}
            </p>
          )}
        </label>
      </FormSection>

      <FormSection
        title="About your business"
        description="Optional, but helps us tailor pricing and packaging."
      >
        <label className="sm:col-span-2">
          <FieldLabel
            htmlFor="bulk-organization"
            title="Company, brand, or kitchen name"
            hint="Leave blank if you are buying for personal use"
          />
          <input
            id="bulk-organization"
            type="text"
            autoComplete="organization"
            className={inputBaseClass}
            placeholder="e.g. Spice Route Kitchens Pvt Ltd"
            {...register("organization")}
          />
        </label>

        <label className="sm:col-span-2">
          <FieldLabel
            htmlFor="bulk-business-type"
            title="What best describes you?"
          />
          <select
            id="bulk-business-type"
            className={cn(inputBaseClass, "appearance-auto")}
            {...register("businessType")}
          >
            {BUSINESS_TYPES.map((o) => (
              <option key={o.value || "empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </FormSection>

      <FormSection
        title="What you need"
        description={`Wholesale minimum is ${WHOLESALE_MIN_GRAMS_LABEL}. Rough numbers are fine—we confirm exact grams and pricing on call.`}
      >
        <label className="sm:col-span-2">
          <FieldLabel
            htmlFor="bulk-quantity"
            title="How much saffron do you need?"
            hint={`Minimum ${WHOLESALE_MIN_GRAMS_LABEL} for wholesale`}
          />
          <select
            id="bulk-quantity"
            className={cn(inputBaseClass, "appearance-auto")}
            {...register("approxGrams")}
          >
            {QUANTITY_BUCKETS.map((o) => (
              <option key={o.value || "q-empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <FieldLabel
            htmlFor="bulk-message"
            title="Anything else you want to tell us?"
            hint="Optional — delivery city, GSTIN, grade preference, or special instructions"
          />
          <textarea
            id="bulk-message"
            rows={4}
            aria-invalid={errors.message ? true : undefined}
            className={cn(
              inputBaseClass,
              "min-h-[112px] resize-y",
              errors.message && fieldErrorClass,
            )}
            placeholder="e.g. Need GST invoice, deliver to Hyderabad, prefer Mongra Grade A++ only…"
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-700 font-body" role="alert">
              {errors.message.message}
            </p>
          )}
        </label>
      </FormSection>

      {submitMessage && submitState === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 font-body"
        >
          {submitMessage}
        </p>
      )}

      <div className="space-y-3 border-t border-secondary-border/20 pt-6">
        <Button
          type="submit"
          disabled={submitState === "loading"}
          size="lg"
          className="relative w-full min-h-[52px] rounded-2xl text-base shadow-md shadow-primary/20 sm:w-auto sm:min-w-[260px]"
        >
          {submitState === "loading" ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
                aria-hidden
              />
              Sending enquiry…
            </span>
          ) : (
            "Submit wholesale enquiry"
          )}
        </Button>
        <p className="text-xs text-text-muted font-body leading-relaxed">
          By submitting, you agree we may contact you on the phone number above.
          We only use your details for this enquiry—we never sell wholesale
          contact lists.
        </p>
      </div>
    </form>
  );
}
