"use client";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={loading ? undefined : onCancel} />

      <div className="relative w-full max-w-md rounded-2xl border border-oak/35 bg-paper/95 p-5 shadow-panel sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-espresso">{title}</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-espresso/80">{message}</p>
          </div>

          <button
            type="button"
            onClick={loading ? undefined : onCancel}
            className="rounded-lg border border-oak/40 bg-white px-3 py-1.5 text-sm font-semibold text-espresso disabled:opacity-60"
            disabled={loading}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso disabled:opacity-60 sm:w-fit"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 font-semibold text-paper disabled:opacity-60 sm:w-fit ${
              danger ? "bg-red-700" : "bg-espresso"
            }`}
          >
            {loading ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}