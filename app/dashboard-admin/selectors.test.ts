import { describe, expect, it } from "vitest";
import {
  buildKpiMetrics,
  deriveAuditActionOptions,
  deriveCities,
  filterUsers,
} from "./selectors";

describe("dashboard-admin selectors", () => {
  it("filters users by role and search query", () => {
    const users = [
      { id: "1", email: "a@test.com", role: 0, username: "alpha" },
      { id: "2", email: "b@test.com", role: 2, username: "beta" },
    ];

    const result = filterUsers(users as any, "2", "bet");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("derives city and audit action options uniquely", () => {
    const cities = deriveCities([
      { id: "1", name: "A", city: "Prishtine" },
      { id: "2", name: "B", city: "Prishtine" },
      { id: "3", name: "C", city: "Peje" },
    ] as any);

    const actions = deriveAuditActionOptions([
      { id: "1", action: "DELETE" },
      { id: "2", action: "DELETE" },
      { id: "3", action: "UPDATE" },
    ] as any);

    expect(cities).toEqual(["Prishtine", "Peje"]);
    expect(actions).toEqual(["DELETE", "UPDATE"]);
  });

  it("builds KPI metrics with fallback values", () => {
    const metrics = buildKpiMetrics(null, [{ id: "1" } as any], [{ id: "2" } as any], [{ id: "u" } as any]);

    expect(metrics.totalBusinessesKpi).toBe(2);
    expect(metrics.pendingBusinessesKpi).toBe(1);
    expect(metrics.approvedBusinessesKpi).toBe(1);
    expect(metrics.totalUsersKpi).toBe(1);
    expect(metrics.toKpiProgress(1)).toBeGreaterThan(0);
  });
});
