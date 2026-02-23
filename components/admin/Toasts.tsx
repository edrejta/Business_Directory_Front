"use client";

export type ToastItem = {
  id: number;
  message: string;
  variant?: "success" | "danger" | "warning" | "info";
};

type ToastsProps = {
  items: ToastItem[];
  onClose: (id: number) => void;
};

export default function Toasts({ items, onClose }: ToastsProps) {
  if (items.length === 0) return null;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }} aria-live="polite" aria-atomic="true">
      {items.map((item) => (
        <div key={item.id} className={`toast show text-bg-${item.variant ?? "success"} border-0 mb-2`} role="status">
          <div className="d-flex">
            <div className="toast-body">{item.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => onClose(item.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
