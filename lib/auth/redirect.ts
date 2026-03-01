export function getRedirectPath(role: number | string): string {
  const n = typeof role === "string" ? Number(role) : role;

  if (!Number.isNaN(n)) {
    if (n === 2) return "/dashboard-admin";
    if (n === 1) return "/dashboard-business";
    return "/dashboard-user";
  }

  const r = String(role).toLowerCase();
  if (r.includes("admin")) return "/dashboard-admin";
  if (r.includes("business") || r.includes("owner")) return "/dashboard-business";
  return "/dashboard-user";
}

export function getRoleLabel(role: number | string): string {
  const n = typeof role === "string" ? Number(role) : role;

  if (!Number.isNaN(n)) {
    if (n === 2) return "Admin";
    if (n === 1) return "Biznes";
    return "User";
  }

  const r = String(role).toLowerCase();
  if (r.includes("admin")) return "Admin";
  if (r.includes("business") || r.includes("owner")) return "Biznes";
  return "User";
}