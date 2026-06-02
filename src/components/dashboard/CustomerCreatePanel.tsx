"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  billingAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  taxId: "",
  notes: "",
};

export function CustomerCreatePanel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(body.error || "Could not create customer.");
      }
      setForm(EMPTY_FORM);
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create customer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-secondary-border/20 bg-background-alt p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-display text-lg font-bold text-text-primary">
            Add customer
          </p>
          <p className="text-xs text-text-muted font-body">
            Create customer records without leaving this page.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={open ? "outline" : "primary"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "New Customer"}
        </Button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["name", "Name *"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["companyName", "Company"],
              ["city", "City"],
              ["state", "State"],
              ["postalCode", "Postal code"],
              ["country", "Country"],
              ["taxId", "Tax ID"],
            ].map(([key, label]) => (
              <label key={key} className="space-y-1 text-sm font-body">
                <span className="text-text-primary">{label}</span>
                <input
                  required={key === "name"}
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
                />
              </label>
            ))}
          </div>
          <label className="block space-y-1 text-sm font-body">
            <span className="text-text-primary">Billing Address</span>
            <textarea
              rows={3}
              value={form.billingAddress}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, billingAddress: e.target.value }))
              }
              className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
            />
          </label>
          <label className="block space-y-1 text-sm font-body">
            <span className="text-text-primary">Notes</span>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700 font-body" role="alert">
              {error}
            </p>
          ) : null}
          <div className="pt-1">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Creating..." : "Create Customer"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
