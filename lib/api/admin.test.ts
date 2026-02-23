import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAdminUsers, normalizeDashboard } from "./admin";
import { authenticatedJson } from "./client";

vi.mock("./client", () => ({
  authenticatedJson: vi.fn(),
}));

const authenticatedJsonMock = vi.mocked(authenticatedJson);

describe("normalizeDashboard", () => {
  beforeEach(() => {
    authenticatedJsonMock.mockReset();
  });

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

  it("normalizes admin users so role is always numeric", async () => {
    authenticatedJsonMock.mockResolvedValueOnce([
      { id: "u1", email: "admin@example.com", role: "2", username: "admin" },
      { id: "u2", email: "owner@example.com", role: 1, username: "owner" },
    ]);

    const users = await getAdminUsers();

    expect(users).toEqual([
      {
        id: "u1",
        email: "admin@example.com",
        role: 2,
        username: "admin",
        fullName: undefined,
        createdAt: undefined,
        status: undefined,
      },
      {
        id: "u2",
        email: "owner@example.com",
        role: 1,
        username: "owner",
        fullName: undefined,
        createdAt: undefined,
        status: undefined,
      },
    ]);
  });
});
