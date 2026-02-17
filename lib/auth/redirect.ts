export function getRedirectPath(role: number): string {
  const map: Record<number, string> = {
    0: "/dashboard-user",
    1: "/dashboard-business",
    2: "/dashboard-admin",
  };
  return map[role] ?? "/dashboard-user";
}
