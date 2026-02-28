"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownAction = {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
};

type ActionDropdownProps = {
  id: string;
  actions: DropdownAction[];
  buttonLabel?: string;
};

export default function ActionDropdown({ id, actions, buttonLabel = "Actions" }: ActionDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onOutsideClick);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onOutsideClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <button
        className="inline-flex items-center rounded-md border border-[var(--coffee-border)] px-2 py-1 text-xs font-medium text-[var(--coffee-text)] transition-colors hover:bg-[var(--coffee-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coffee-primary)]"
        type="button"
        id={`dropdown-${id}`}
        aria-expanded={open}
        aria-label={`Open actions for ${id}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {buttonLabel}
      </button>

      {open && (
        <ul
          className="absolute right-0 z-20 mt-1 min-w-44 overflow-hidden rounded-md border border-[var(--coffee-border)] bg-[var(--coffee-surface)] py-1 shadow-lg"
          aria-labelledby={`dropdown-${id}`}
        >
          {actions.map((action) => (
            <li key={action.key}>
              <button
                type="button"
                className={`block w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-[var(--coffee-border)] disabled:cursor-not-allowed disabled:opacity-60 ${
                  action.danger ? "text-red-700" : "text-[var(--coffee-text)]"
                }`}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
