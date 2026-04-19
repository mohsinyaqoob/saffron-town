"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { HEARD_ABOUT_CHANNELS } from "@/data/heard-about-channels";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  id?: string;
  disabled?: boolean;
  inputClassName?: string;
};

export const HearAboutCombobox = forwardRef<HTMLInputElement, Props>(
  function HearAboutCombobox(
    { value, onChange, onBlur, error, id, disabled, inputClassName },
    ref,
  ) {
    const listId = useId();
    const errId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(value);
    const [highlight, setHighlight] = useState(0);

    const filtered = HEARD_ABOUT_CHANNELS.filter((c) =>
      c.toLowerCase().includes(draft.trim().toLowerCase()),
    );

    useEffect(() => {
      setDraft(value);
    }, [value]);

    const pick = useCallback(
      (ch: string) => {
        onChange(ch);
        setDraft(ch);
        setOpen(false);
        onBlur();
      },
      [onChange, onBlur],
    );

    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    const syncFromDraft = () => {
      const t = draft.trim();
      if (!t) {
        onChange("");
        setDraft("");
        return;
      }
      const exact = HEARD_ABOUT_CHANNELS.find(
        (c) => c.toLowerCase() === t.toLowerCase(),
      );
      if (exact) {
        onChange(exact);
        setDraft(exact);
        return;
      }
      onChange("");
      setDraft(value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setDraft(value);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered.length > 0) {
        e.preventDefault();
        pick(filtered[highlight] ?? filtered[0]);
      }
    };

    return (
      <div ref={containerRef} className="relative">
        <label
          className="block text-sm font-semibold text-text-primary font-body"
          htmlFor={id}
        >
          How did you hear about us?
          <span className="ml-1 text-xs font-normal text-text-muted">
            (optional)
          </span>
          <input
            ref={ref}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            disabled={disabled}
            value={draft}
            onChange={(e) => {
              const next = e.target.value;
              setDraft(next);
              setHighlight(0);
              setOpen(true);
              if (value) onChange("");
            }}
            onFocus={() => {
              setHighlight(0);
              setOpen(true);
            }}
            onBlur={() => {
              window.setTimeout(() => {
                syncFromDraft();
                onBlur();
              }, 0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type to search…"
            autoComplete="off"
            id={id}
            className={cn(inputClassName)}
          />
        </label>
        {open && filtered.length > 0 ? (
          <div
            id={listId}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-secondary-border/30 bg-background py-1 shadow-lg"
          >
            {filtered.map((ch, i) => (
              <div key={ch} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={ch === value}
                  className={cn(
                    "flex w-full px-3 py-2.5 text-left text-sm font-body text-text-primary hover:bg-surface-muted",
                    i === highlight && "bg-surface-muted",
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(ch)}
                >
                  {ch}
                </button>
              </div>
            ))}
          </div>
        ) : open && draft.trim() ? (
          <p
            className="absolute z-50 mt-1 w-full rounded-xl border border-secondary-border/20 bg-background px-3 py-2 text-xs text-secondary font-body shadow-lg"
            role="status"
          >
            No matches. Try another word or clear the field.
          </p>
        ) : null}
        {error && (
          <p
            id={errId}
            className="mt-1.5 text-xs text-red-700 font-body"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

HearAboutCombobox.displayName = "HearAboutCombobox";
