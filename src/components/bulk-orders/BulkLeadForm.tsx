"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  type BulkLeadFormClientValues,
  bulkLeadFormClientSchema,
} from "@/lib/bulk-enquiry-schema";
import { cn } from "@/lib/utils";

const BUSINESS_TYPES = [
  { value: "", label: "Select one (optional)" },
  { value: "restaurant", label: "Restaurant / cloud kitchen" },
  { value: "sweet-shop", label: "Mithai / sweet shop" },
  { value: "hotel", label: "Hotel / catering" },
  { value: "retailer", label: "Retail / speciality store" },
  { value: "exporter", label: "Exporter / distributor" },
  { value: "corporate", label: "Corporate gifting" },
  { value: "other", label: "Other" },
] as const;

const QUANTITY_BUCKETS = [
  { value: "", label: "Rough quantity (optional)" },
  { value: "20-50g", label: "20g – 50g" },
  { value: "50-100g", label: "50g – 100g" },
  { value: "100g-500g", label: "100g – 500g" },
  { value: "500g+", label: "500g+" },
  { value: "custom", label: "Custom / recurring" },
] as const;

const inputBaseClass =
  "mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/30 placeholder:text-text-muted focus:ring-2 border-secondary-border/40";

const fieldErrorClass =
  "border-red-400/80 ring-2 ring-red-200/60 focus:border-red-400 focus:ring-red-200/80";

const defaultValues: BulkLeadFormClientValues = {
  name: "",
  phone: "",
  email: "",
  organization: "",
  businessType: "",
  approxGrams: "",
  timeline: "",
  message: "",
};

export function BulkLeadForm() {
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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
      email: values.email.trim(),
      organization: values.organization?.trim() || "",
      businessType: values.businessType?.trim() || "",
      approxGrams: values.approxGrams?.trim() || "",
      timeline: values.timeline?.trim() || "",
      message: values.message.trim(),
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
        setSubmitState("success");
        setSubmitMessage(
          "Thank you—we will call or reply shortly. Prefer faster? Tap Call or WhatsApp below.",
        );
        reset(defaultValues);
        return;
      }

      setSubmitState("error");
      setSubmitMessage(
        data.message ||
          "Something went wrong. Please call us—our team responds fastest on phone.",
      );
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
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-text-primary font-body">
            Your name<span className="text-red-600"> *</span>
          </span>
          <input
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            className={cn(inputBaseClass, errors.name && fieldErrorClass)}
            placeholder="Who should we greet?"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-700 font-body" role="alert">
              {errors.name.message}
            </p>
          )}
        </label>

        <label>
          <span className="text-sm font-semibold text-text-primary font-body">
            Phone<span className="text-red-600"> *</span>
          </span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={errors.phone ? true : undefined}
            className={cn(inputBaseClass, errors.phone && fieldErrorClass)}
            placeholder="Mobile you answer"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-700 font-body" role="alert">
              {errors.phone.message}
            </p>
          )}
        </label>

        <label>
          <span className="text-sm font-semibold text-text-primary font-body">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            className={cn(inputBaseClass, errors.email && fieldErrorClass)}
            placeholder="Optional — helpful for quotations"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-700 font-body" role="alert">
              {errors.email.message}
            </p>
          )}
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-text-primary font-body">
            Business / outlet name
          </span>
          <input
            type="text"
            autoComplete="organization"
            className={inputBaseClass}
            placeholder="Optional"
            {...register("organization")}
          />
        </label>

        <label>
          <span className="text-sm font-semibold text-text-primary font-body">
            You represent
          </span>
          <select
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

        <label>
          <span className="text-sm font-semibold text-text-primary font-body">
            Quantity hint
          </span>
          <select
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
          <span className="text-sm font-semibold text-text-primary font-body">
            When do you need it?
          </span>
          <input
            type="text"
            className={inputBaseClass}
            placeholder="e.g. before Diwali · ongoing monthly · ASAP"
            {...register("timeline")}
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-text-primary font-body">
            What should we arrange?<span className="text-red-600"> *</span>
          </span>
          <textarea
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            className={cn(
              inputBaseClass,
              "min-h-[132px] resize-y",
              errors.message && fieldErrorClass,
            )}
            placeholder="Grades you want (e.g. Mongra), destination city, invoicing GSTIN, recurring or one-off—we read every enquiry."
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-700 font-body" role="alert">
              {errors.message.message}
            </p>
          )}
        </label>
      </div>

      {submitMessage && (
        <p
          role="status"
          className={cn(
            "rounded-xl border px-3 py-2.5 text-sm font-body",
            submitState === "success"
              ? "border-green-600/35 bg-green-50 text-green-950"
              : "border-amber-300 bg-amber-50 text-amber-950",
          )}
        >
          {submitMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={submitState === "loading"}
        size="lg"
        className="relative w-full min-h-[52px] rounded-2xl text-base shadow-md shadow-primary/20 sm:w-auto sm:min-w-[220px]"
      >
        {submitState === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
              aria-hidden
            />
            Sending…
          </span>
        ) : (
          "Send my enquiry"
        )}
      </Button>
      <p className="text-xs text-text-muted font-body leading-relaxed">
        By submitting you agree we may phone or WhatsApp you about this enquiry.
        We never sell wholesale lists—we only reply to genuine bulk needs.
      </p>
    </form>
  );
}
