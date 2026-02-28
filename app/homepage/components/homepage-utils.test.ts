import { describe, expect, it } from "vitest";
import {
  normalizeBusiness,
  normalizeSearchKeyword,
  resolveCityFromCandidates,
  type ApiBusiness,
} from "./homepage-utils";

describe("homepage-utils", () => {
  it("normalizes search keywords by removing near-me phrases", () => {
    expect(normalizeSearchKeyword(" Restaurant near me  ")).toBe("Restaurant");
    expect(normalizeSearchKeyword("pharmacy  afër meje")).toBe("pharmacy");
  });

  it("resolves city aliases for Prishtine/Prishtina", () => {
    expect(resolveCityFromCandidates("Prishtine", ["Prishtinë", "Peje"])).toBe("Prishtinë");
  });

  it("normalizes business id using businessId fallback", () => {
    const input: ApiBusiness = {
      businessId: "b-123",
      BusinessName: "Cafe Uno",
      City: "Prishtina",
      BusinessType: "Cafe",
    };

    const result = normalizeBusiness(input);
    expect(result.id).toBe("b-123");
    expect(result.name).toBe("Cafe Uno");
    expect(result.location).toBe("Prishtina");
  });
});
