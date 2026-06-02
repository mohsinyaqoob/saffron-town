"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type CustomerWithInvoices = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  taxId: string | null;
  billingAddress: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  notes: string | null;
  _count: {
    invoices: number;
  };
};

type Props = {
  customers: CustomerWithInvoices[];
};

export function CustomerList({ customers }: Props) {
  const router = useRouter();
  const [editingCustomer, setEditingCustomer] =
    useState<CustomerWithInvoices | null>(null);
  const [deletingCustomer, setDeletingCustomer] =
    useState<CustomerWithInvoices | null>(null);

  const [editForm, setEditForm] = useState({
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
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(customer: CustomerWithInvoices) {
    setEditingCustomer(customer);
    setError(null);
    setEditForm({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      companyName: customer.companyName || "",
      billingAddress: customer.billingAddress || "",
      city: customer.city || "",
      state: customer.state || "",
      postalCode: customer.postalCode || "",
      country: customer.country || "",
      taxId: customer.taxId || "",
      notes: customer.notes || "",
    });
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCustomer) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(body.error || "Could not update customer.");
      }

      setEditingCustomer(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update customer.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingCustomer) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/customers/${deletingCustomer.id}`, {
        method: "DELETE",
      });

      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(body.error || "Could not delete customer.");
      }

      setDeletingCustomer(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete customer.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-secondary-border/20 bg-background-alt shadow-sm">
        <table className="min-w-full text-sm font-body">
          <thead className="bg-surface-muted/40 text-left text-xs uppercase tracking-[0.12em] text-text-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3 text-center">Invoices</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-secondary-border/15 transition-colors hover:bg-surface-muted/20"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-text-primary">
                    {customer.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {customer.companyName || "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-secondary">
                  <p>{customer.email || "—"}</p>
                  <p className="text-xs">{customer.phone || "—"}</p>
                </td>
                <td className="px-4 py-3 text-secondary">
                  {[customer.city, customer.state, customer.country]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-primary">
                  {customer._count.invoices}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(customer)}
                      className="!px-3.5 !py-1.5 text-xs font-semibold"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setDeletingCustomer(customer)}
                      className="!px-3.5 !py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-95"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-secondary-border/30 bg-background p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-lg font-bold text-text-primary">
              Edit Customer Details
            </h3>
            <p className="text-xs text-text-muted mb-4 font-body">
              Modify details for {editingCustomer.name}.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                      value={editForm[key as keyof typeof editForm]}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
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
                  value={editForm.billingAddress}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      billingAddress: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
                />
              </label>
              <label className="block space-y-1 text-sm font-body">
                <span className="text-text-primary">Notes</span>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full rounded-xl border border-secondary-border/25 bg-background px-3 py-2 outline-none ring-primary/40 focus:ring"
                />
              </label>

              {error ? (
                <p className="text-sm text-red-700 font-body" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCustomer(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Customer Confirmation Modal */}
      {deletingCustomer ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-secondary-border/30 bg-background p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-text-primary">
              Delete Customer?
            </h3>
            <p className="text-sm text-text-muted mt-2 font-body">
              Are you sure you want to delete{" "}
              <strong>{deletingCustomer.name}</strong>?
            </p>
            <p className="text-xs text-red-600 mt-2 font-body">
              Note: This is a soft-deletion. Linked invoices will not be
              affected, but this customer will no longer be available for new
              invoices.
            </p>

            {error ? (
              <p className="text-sm text-red-700 mt-2 font-body" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex justify-end gap-3 mt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingCustomer(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="!bg-red-600 hover:!bg-red-700 text-white border-transparent"
              >
                {deleting ? "Deleting..." : "Delete Customer"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
