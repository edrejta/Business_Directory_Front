"use client";

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
  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-secondary dropdown-toggle"
        type="button"
        id={`dropdown-${id}`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label={`Open actions for ${id}`}
      >
        {buttonLabel}
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${id}`}>
        {actions.map((action) => (
          <li key={action.key}>
            <button
              type="button"
              className={`dropdown-item${action.danger ? " text-danger" : ""}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
