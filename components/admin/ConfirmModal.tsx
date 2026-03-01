"use client";

import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger" | "warning";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const confirmTone: Record<NonNullable<ConfirmModalProps["confirmVariant"]>, string> = {
  primary: "border-[var(--coffee-primary)] bg-[var(--coffee-primary)] text-[var(--coffee-bg)] hover:bg-[var(--coffee-text)]",
  warning: "border-amber-700 bg-amber-700 text-white hover:bg-amber-800",
  danger: "border-red-700 bg-red-700 text-white hover:bg-red-800",
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  confirmVariant = "primary",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    confirmButtonRef.current?.focus();

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
      aria-labelledby="confirmModalLabel"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--coffee-border)] bg-[var(--coffee-surface)] text-[var(--coffee-text)] shadow-xl">
        <div className="flex items-start justify-between border-b border-[var(--coffee-border)] px-4 py-3">
          <h5 className="text-base font-semibold" id="confirmModalLabel">
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

        <div className="px-4 py-3">
          <p className="text-sm">{message}</p>
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
            ref={confirmButtonRef}
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
