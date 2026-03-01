import { describe, expect, it } from "vitest";
import { resolveBusinessId } from "@/lib/utils/businessId";

describe("resolveBusinessId", () => {
  it("returns primary id when present", () => {
    expect(resolveBusinessId({ id: "alpha" })).toBe("alpha");
  });

  it("falls back to businessId variants", () => {
    expect(resolveBusinessId({ businessId: "beta" })).toBe("beta");
    expect(resolveBusinessId({ BusinessId: "gamma" })).toBe("gamma");
  });

  it("returns empty string when no known id exists", () => {
    expect(resolveBusinessId({})).toBe("");
  });
});
