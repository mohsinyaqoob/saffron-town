"use client";

import {
  type Customer,
  type Invoice,
  type InvoiceLineItem,
  InvoiceStatus,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

type CustomerPick = Pick<
  Customer,
  | "id"
  | "name"
  | "email"
  | "phone"
  | "companyName"
  | "billingAddress"
  | "city"
  | "state"
  | "postalCode"
  | "country"
>;

type InvoiceWithItems = Invoice & { lineItems: InvoiceLineItem[] };

type Props = {
  mode: "create" | "edit";
  initialInvoiceNumber: string;
  initialCustomers: CustomerPick[];
  initialInvoice?: InvoiceWithItems & { customer: CustomerPick };
};

type LineDraft = {
  id: string;
  description: string;
  quantity: number;
  unitPricePaise: number;
  unitPriceInput: string;
  taxRatePercent: number;
  discountPaise: number;
  discountInput: string;
};

function formatMoney(paise: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function moneyInputToPaise(value: string) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.round(n * 100));
}

function paiseToMoneyInput(value: number) {
  return (value / 100).toFixed(2);
}

export function InvoiceForm({
  mode,
  initialInvoiceNumber,
  initialCustomers,
  initialInvoice,
}: Props) {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerPick[]>(() => {
    if (initialInvoice?.customer) {
      const exists = initialCustomers.some(
        (c) => c.id === initialInvoice.customer.id,
      );
      if (!exists) {
        return [initialInvoice.customer, ...initialCustomers];
      }
    }
    return initialCustomers;
  });
  const [query, setQuery] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerId, setCustomerId] = useState(
    initialInvoice?.customerId ?? "",
  );
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber ?? initialInvoiceNumber,
  );
  const [status, setStatus] = useState<InvoiceStatus>(
    initialInvoice?.status ?? InvoiceStatus.DRAFT,
  );
  const [issueDate, setIssueDate] = useState(
    (initialInvoice?.issueDate ?? new Date()).toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate
      ? initialInvoice.dueDate.toISOString().slice(0, 10)
      : "",
  );
  const [currency, setCurrency] = useState(initialInvoice?.currency ?? "INR");
  const [notes, setNotes] = useState(initialInvoice?.notes ?? "");
  const [paymentTerms, setPaymentTerms] = useState(
    initialInvoice?.paymentTerms ?? "",
  );
  const [lines, setLines] = useState<LineDraft[]>(
    initialInvoice?.lineItems.length
      ? initialInvoice.lineItems.map((line) => ({
          id: line.id,
          description: line.description,
          quantity: line.quantity,
          unitPricePaise: line.unitPricePaise,
          unitPriceInput: paiseToMoneyInput(line.unitPricePaise),
          taxRatePercent: line.taxRatePercent,
          discountPaise: line.discountPaise,
          discountInput: paiseToMoneyInput(line.discountPaise),
        }))
      : [
          {
            id: crypto.randomUUID(),
            description: "",
            quantity: 1,
            unitPricePaise: 0,
            unitPriceInput: "0.00",
            taxRatePercent: 0,
            discountPaise: 0,
            discountInput: "0.00",
          },
        ],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    billingAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      if (query.trim().length < 2) return;
      try {
        const res = await fetch(
          `/api/customers?query=${encodeURIComponent(query.trim())}&limit=20`,
        );
        if (!res.ok) return;
        const body = (await res.json()) as { rows?: CustomerPick[] };
        if (body.rows) setCustomers(body.rows);
      } catch {
        // keep current options on network errors
      }
    }, 150);
    return () => window.clearTimeout(handle);
  }, [query]);

  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null;

  const filteredCustomers = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q),
    );
  }, [customers, query]);

  const totals = useMemo(() => {
    let subtotalPaise = 0;
    let taxTotalPaise = 0;
    let discountTotalPaise = 0;
    let totalPaise = 0;
    for (const line of lines) {
      const lineSubtotal = line.quantity * line.unitPricePaise;
      const discounted = Math.max(0, lineSubtotal - line.discountPaise);
      const tax = Math.round((discounted * line.taxRatePercent) / 100);
      subtotalPaise += lineSubtotal;
      taxTotalPaise += tax;
      discountTotalPaise += line.discountPaise;
      totalPaise += discounted + tax;
    }
    return { subtotalPaise, taxTotalPaise, discountTotalPaise, totalPaise };
  }, [lines]);

  async function submitInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!customerId) {
        throw new Error("Please select or create a customer.");
      }

      const payload = {
        invoiceNumber: invoiceNumber.trim() || "AUTO_INVOICE_NUMBER",
        status,
        issueDate,
        dueDate,
        currency,
        customerId,
        notes,
        paymentTerms,
        lineItems: lines.map((line) => ({
          description: line.description,
          quantity: Number(line.quantity),
          unitPricePaise: line.unitPricePaise,
          taxRatePercent: Number(line.taxRatePercent),
          discountPaise: line.discountPaise,
        })),
      };

      const target =
        mode === "create"
          ? "/api/invoices"
          : `/api/invoices/${initialInvoice?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(target, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as {
        error?: string;
        invoice?: { id: string };
      };
      if (!res.ok) {
        throw new Error(body.error || "Could not save invoice.");
      }

      if (body.invoice?.id) {
        router.push(`/dashboard/invoices/${body.invoice.id}/edit`);
      } else {
        router.push("/dashboard/invoices");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save invoice.");
    } finally {
      setSaving(false);
    }
  }

  async function createCustomerInline() {
    setCreatingCustomer(true);
    setError(null);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      const body = (await res.json()) as {
        error?: string;
        customer?: CustomerPick;
      };
      if (!res.ok || !body.customer) {
        throw new Error(body.error || "Could not create customer.");
      }
      const created = body.customer;
      setCustomers((prev) => [
        created,
        ...prev.filter((c) => c.id !== created.id),
      ]);
      setCustomerId(created.id);
      setQuery(created.name);
      setShowAddCustomer(false);
      setCustomerOpen(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        billingAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create customer.");
    } finally {
      setCreatingCustomer(false);
    }
  }

  return (
    <form onSubmit={submitInvoice} className="space-y-6">
      <section className="grid gap-4 rounded-2xl border border-secondary-border/20 bg-background-alt p-4 lg:grid-cols-3">
        <label className="space-y-1 text-sm font-body">
          <span className="text-text-primary">Invoice Number</span>
          <input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder={initialInvoiceNumber}
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
          />
          <span className="text-xs text-text-muted">
            Leave blank to auto-generate.
          </span>
        </label>
        <label className="space-y-1 text-sm font-body">
          <span className="text-text-primary">Issue Date</span>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm font-body">
          <span className="text-text-primary">Due Date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm font-body">
          <span className="text-text-primary">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
          >
            {Object.values(InvoiceStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-body">
          <span className="text-text-primary">Currency</span>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={8}
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-secondary-border/20 bg-background-alt p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">
              Customer
            </h2>
            <p className="text-xs text-text-muted">
              Search existing customer or create one inline.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowAddCustomer(true)}
          >
            + New Customer
          </Button>
        </div>

        <div className="relative mt-3">
          <input
            type="text"
            role="combobox"
            aria-expanded={customerOpen}
            aria-autocomplete="list"
            value={query || selectedCustomer?.name || ""}
            onChange={(e) => {
              setQuery(e.target.value);
              setCustomerOpen(true);
            }}
            onFocus={() => setCustomerOpen(true)}
            placeholder="Search by name, email, phone…"
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 text-sm outline-none ring-primary/40 focus:ring"
          />
          {customerOpen ? (
            <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-secondary-border/25 bg-background shadow-lg">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setCustomerId(customer.id);
                      setQuery(customer.name);
                      setCustomerOpen(false);
                    }}
                    className="block w-full border-b border-secondary-border/10 px-3 py-2 text-left text-sm hover:bg-surface-muted"
                  >
                    <p className="font-medium text-text-primary">
                      {customer.name}
                    </p>
                    <p className="text-xs text-secondary">
                      {customer.email ||
                        customer.phone ||
                        customer.companyName ||
                        "—"}
                    </p>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-text-muted">
                  No customers found. Create a new one.
                </p>
              )}
            </div>
          ) : null}
        </div>

        {selectedCustomer ? (
          <div className="mt-3 rounded-xl border border-secondary-border/20 bg-background p-3 text-sm">
            <p className="font-semibold text-text-primary">
              {selectedCustomer.name}
            </p>
            <p className="text-secondary">
              {selectedCustomer.email ||
                selectedCustomer.phone ||
                "No contact details"}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {[
                selectedCustomer.billingAddress,
                selectedCustomer.city,
                selectedCustomer.state,
                selectedCustomer.postalCode,
                selectedCustomer.country,
              ]
                .filter(Boolean)
                .join(", ") || "No billing address on file."}
            </p>
          </div>
        ) : null}
      </section>

      <section className="space-y-3 rounded-2xl border border-secondary-border/20 bg-background-alt p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-text-primary">
            Line Items
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setLines((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  description: "",
                  quantity: 1,
                  unitPricePaise: 0,
                  unitPriceInput: "0.00",
                  taxRatePercent: 0,
                  discountPaise: 0,
                  discountInput: "0.00",
                },
              ])
            }
          >
            + Add line
          </Button>
        </div>

        <div className="space-y-3">
          {lines.map((line) => (
            <div
              key={line.id}
              className="grid gap-2 rounded-xl border border-secondary-border/20 bg-background p-3 lg:grid-cols-12"
            >
              <input
                value={line.description}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l) =>
                      l.id === line.id
                        ? { ...l, description: e.target.value }
                        : l,
                    ),
                  )
                }
                placeholder="Description"
                className="lg:col-span-6 rounded-lg border border-secondary-border/20 px-2.5 py-2 text-sm outline-none ring-primary/40 focus:ring"
              />
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l) =>
                      l.id === line.id
                        ? {
                            ...l,
                            quantity: Math.max(1, Number(e.target.value) || 1),
                          }
                        : l,
                    ),
                  )
                }
                className="lg:col-span-1 rounded-lg border border-secondary-border/20 px-2.5 py-2 text-sm outline-none ring-primary/40 focus:ring"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={line.unitPriceInput}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l) =>
                      l.id === line.id
                        ? {
                            ...l,
                            unitPriceInput: e.target.value,
                            unitPricePaise: moneyInputToPaise(e.target.value),
                          }
                        : l,
                    ),
                  )
                }
                className="lg:col-span-2 rounded-lg border border-secondary-border/20 px-2.5 py-2 text-sm outline-none ring-primary/40 focus:ring"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={line.discountInput}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l) =>
                      l.id === line.id
                        ? {
                            ...l,
                            discountInput: e.target.value,
                            discountPaise: moneyInputToPaise(e.target.value),
                          }
                        : l,
                    ),
                  )
                }
                className="lg:col-span-2 rounded-lg border border-secondary-border/20 px-2.5 py-2 text-sm outline-none ring-primary/40 focus:ring"
              />
              <div className="lg:col-span-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setLines((prev) =>
                      prev.length > 1
                        ? prev.filter((l) => l.id !== line.id)
                        : prev,
                    )
                  }
                  className="text-xs text-red-700 underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-secondary-border/20 bg-background-alt p-4 lg:grid-cols-2">
        <label className="space-y-1 text-sm font-body">
          <span className="text-text-primary">Payment Terms</span>
          <textarea
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm font-body">
          <span className="text-text-primary">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
          />
        </label>
        <div className="lg:col-span-2 rounded-xl border border-secondary-border/20 bg-background p-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotalPaise, currency)}</span>
          </div>
          {totals.taxTotalPaise > 0 && (
            <div className="mt-1 flex justify-between">
              <span>Tax</span>
              <span>{formatMoney(totals.taxTotalPaise, currency)}</span>
            </div>
          )}
          {totals.discountTotalPaise > 0 && (
            <div className="mt-1 flex justify-between">
              <span>Discount</span>
              <span>- {formatMoney(totals.discountTotalPaise, currency)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-secondary-border/20 pt-2 font-display text-lg font-bold text-primary">
            <span>Total</span>
            <span>{formatMoney(totals.totalPaise, currency)}</span>
          </div>
        </div>
      </section>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create Invoice"
              : "Save Changes"}
        </Button>
        {initialInvoice?.id ? (
          <a
            href={`/api/invoices/${initialInvoice.id}/pdf`}
            className="text-sm text-primary underline-offset-2 hover:underline"
          >
            Download PDF
          </a>
        ) : null}
      </div>

      {showAddCustomer ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-secondary-border/30 bg-background p-4">
            <h3 className="font-display text-lg font-bold text-text-primary">
              New Customer
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["companyName", "Company"],
                ["city", "City"],
                ["state", "State"],
                ["postalCode", "Postal code"],
                ["country", "Country"],
              ].map(([key, label]) => (
                <label key={key} className="space-y-1 text-sm">
                  <span className="text-text-primary">{label}</span>
                  <input
                    value={newCustomer[key as keyof typeof newCustomer]}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-secondary-border/20 px-2.5 py-2 outline-none ring-primary/40 focus:ring"
                  />
                </label>
              ))}
              <label className="space-y-1 text-sm sm:col-span-2">
                <span className="text-text-primary">Billing Address</span>
                <textarea
                  rows={3}
                  value={newCustomer.billingAddress}
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      billingAddress: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-secondary-border/20 px-2.5 py-2 outline-none ring-primary/40 focus:ring"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddCustomer(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={createCustomerInline}
                disabled={creatingCustomer}
              >
                {creatingCustomer ? "Creating..." : "Create Customer"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
