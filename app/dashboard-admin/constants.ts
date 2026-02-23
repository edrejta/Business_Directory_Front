export const ADMIN_ROLE = 2;
export const USER_ROLE = 0;
export const BUSINESS_ROLE = 1;

export const PENDING_STATUS = "Pending";
export const APPROVED_STATUS = "Approved";
export const PAGE_SIZE = 8;

export const ROLE_OPTIONS = [
  { value: 0, label: "User" },
  { value: 1, label: "Business Owner" },
  { value: 2, label: "Admin" },
] as const;

export const SIDEBAR_ITEMS = [
  { id: "kpi-cards", label: "KPI Cards" },
  { id: "pending-review", label: "Pending Review Inbox" },
  { id: "role-management", label: "Role Management" },
  { id: "business-suspension", label: "Business Suspension" },
  { id: "system-info", label: "System Info" },
  { id: "categories", label: "Categories" },
  { id: "audit-logs", label: "Recent Audit Logs" },
];
