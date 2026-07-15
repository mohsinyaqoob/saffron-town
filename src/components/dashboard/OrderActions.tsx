"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: string;
};

export function OrderActions({ orderId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="mt-5 flex items-center gap-3 border-t border-border-subtle pt-4">
      <button
        type="button"
        onClick={handleDelete}
        onBlur={() => setConfirmDelete(false)}
        disabled={busy}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold font-body transition-colors disabled:opacity-50 ${
          confirmDelete
            ? "border-danger/60 bg-danger/10 text-danger"
            : "border-border-subtle bg-surface-primary text-text-secondary hover:border-danger/40 hover:text-danger"
        }`}
      >
        {busy ? <Spinner /> : <TrashIcon />}
        {confirmDelete ? "Confirm delete?" : "Delete"}
      </button>

      {confirmDelete && (
        <span className="text-[11px] text-text-muted font-body">
          Click again to permanently delete this order.
        </span>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 001-1h4a1 1 0 001 1M9 7H7m10 0h2" />
    </svg>
  );
}
