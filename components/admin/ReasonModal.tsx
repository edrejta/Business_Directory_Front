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
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reasonModalLabel"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="reasonModalLabel">
                {title}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              {extraFields}
              <label htmlFor="reasonTextArea" className="form-label mt-2">
                {reasonLabel}
              </label>
              <textarea
                id="reasonTextArea"
                ref={reasonInputRef}
                className="form-control"
                rows={3}
                value={reason}
                onChange={(event) => onReasonChange(event.target.value)}
                placeholder={reasonPlaceholder}
                aria-label={reasonLabel}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className={`btn btn-${confirmVariant}`} onClick={onConfirm} disabled={isLoading}>
                {isLoading ? "Working..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
