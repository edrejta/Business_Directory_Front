import { describe, it, expect } from "vitest";
import { getRedirectPath } from "./redirect";

describe("getRedirectPath", () => {
  it("role 0 returns /dashboard-user", () => {
    expect(getRedirectPath(0)).toBe("/dashboard-user");
  });

  it("role 1 returns /dashboard-business", () => {
    expect(getRedirectPath(1)).toBe("/dashboard-business");
  });

  it("role 2 returns /dashboard-admin", () => {
    expect(getRedirectPath(2)).toBe("/dashboard-admin");
  });
});
