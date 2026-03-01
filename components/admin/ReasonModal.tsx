"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ReasonModalProps = {
  isOpen: boolean;
  title: string;
  reason: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger" | "warning";
  isLoading?: boolean;
  extraFields?: ReactNode;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

const confirmTone: Record<NonNullable<ReasonModalProps["confirmVariant"]>, string> = {
  primary: "border-[var(--coffee-primary)] bg-[var(--coffee-primary)] text-[var(--coffee-bg)] hover:bg-[var(--coffee-text)]",
  warning: "border-amber-700 bg-amber-700 text-white hover:bg-amber-800",
  danger: "border-red-700 bg-red-700 text-white hover:bg-red-800",
};

export default function ReasonModal({
  isOpen,
  title,
  reason,
  reasonLabel = "Reason (optional)",
  reasonPlaceholder = "Type a reason...",
  confirmLabel = "Confirm",
  confirmVariant = "primary",
  isLoading = false,
  extraFields,
  onReasonChange,
  onConfirm,
  onClose,
}: ReasonModalProps) {
  const reasonInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    reasonInputRef.current?.focus();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reasonModalLabel"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-xl border border-[var(--coffee-border)] bg-[var(--coffee-surface)] text-[var(--coffee-text)] shadow-xl">
        <div className="flex items-start justify-between border-b border-[var(--coffee-border)] px-4 py-3">
          <h5 className="text-base font-semibold" id="reasonModalLabel">
            {title}
          </h5>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-lg leading-none text-[var(--coffee-muted)] transition-colors hover:bg-[var(--coffee-border)] hover:text-[var(--coffee-text)]"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 px-4 py-3">
          {extraFields}

          <label htmlFor="reasonTextArea" className="block text-sm font-medium">
            {reasonLabel}
          </label>

          <textarea
            id="reasonTextArea"
            ref={reasonInputRef}
            className="w-full rounded-md border border-[var(--coffee-border)] bg-[var(--coffee-bg)] px-3 py-2 text-sm text-[var(--coffee-text)] shadow-sm outline-none transition focus:border-[var(--coffee-primary)] focus:ring-2 focus:ring-[var(--coffee-primary)]/30"
            rows={3}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={reasonPlaceholder}
            aria-label={reasonLabel}
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--coffee-border)] px-4 py-3">
          <button
            type="button"
            className="rounded-md border border-[var(--coffee-border)] px-3 py-1.5 text-sm font-medium text-[var(--coffee-text)] transition-colors hover:bg-[var(--coffee-border)]"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${confirmTone[confirmVariant]}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
