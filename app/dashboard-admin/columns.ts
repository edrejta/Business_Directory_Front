import type { DataColumn } from "@/components/admin/DataTable";

export const USER_COLUMNS: DataColumn[] = [
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "actions", label: "Actions", className: "text-right" },
];

export const PENDING_COLUMNS: DataColumn[] = [
  { key: "name", label: "Business" },
  { key: "city", label: "City" },
  { key: "type", label: "Category" },
  { key: "submitted", label: "Submitted" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

export const APPROVED_COLUMNS: DataColumn[] = [
  { key: "name", label: "Business" },
  { key: "city", label: "City" },
  { key: "type", label: "Category" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

export const CATEGORY_COLUMNS: DataColumn[] = [
  { key: "name", label: "Category" },
  { key: "count", label: "Businesses" },
];

export const AUDIT_COLUMNS: DataColumn[] = [
  { key: "action", label: "Action" },
  { key: "target", label: "Target Email", className: "whitespace-nowrap" },
  { key: "reason", label: "Reason" },
  { key: "log", label: "Log ID", className: "whitespace-nowrap" },
  { key: "time", label: "Time" },
];
