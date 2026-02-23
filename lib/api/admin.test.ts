import { describe, expect, it } from "vitest";
import { normalizeDashboard } from "./admin";

describe("normalizeDashboard", () => {
  it("maps DashboardStatsDto-style fields (UserCount/BusinessCount)", () => {
    const result = normalizeDashboard({
      UserCount: 1,
      BusinessCount: 3,
    });

    expect(result.metrics.totalUsers).toBe(1);
    expect(result.metrics.totalBusinesses).toBe(3);
    expect(result.metrics.pendingBusinesses).toBe(0);
    expect(result.metrics.approvedBusinesses).toBe(0);
  });
});
