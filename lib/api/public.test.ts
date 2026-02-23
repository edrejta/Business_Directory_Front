import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, getApprovedBusinessById, getApprovedBusinesses, getHealthStatus } from "./public";
import { API_URL } from "./config";

describe("publicApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("gets approved businesses with filters and normalizes response", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              id: "b1",
              businessName: "Cafe Uno",
              city: "Tirana",
              businessType: 0,
            },
          ],
        }),
    });

    const result = await getApprovedBusinesses({ search: "cafe", city: "Tirana", type: "Cafe" });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/businesses?search=cafe&city=Tirana&type=Cafe`,
      expect.anything(),
    );

    expect(result).toEqual([
      {
        Id: "b1",
        OwnerId: "",
        BusinessName: "Cafe Uno",
        Address: "",
        City: "Tirana",
        Email: "",
        PhoneNumber: "",
        BusinessType: 0,
        Description: "",
        ImageUrl: "",
        Status: "",
        CreatedAt: "",
      },
    ]);
  });

  it("gets business by id", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "x1",
          businessName: "Bakery 21",
          city: "Prishtina",
          businessType: 0,
        }),
    });

    const result = await getApprovedBusinessById("x1");
    expect(result.Id).toBe("x1");
    expect(result.BusinessName).toBe("Bakery 21");
  });

  it("throws ApiError on not found business payload", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ businessName: "No id here" }), // missing id/Id
    });

    await expect(getApprovedBusinessById("missing-id")).rejects.toBeInstanceOf(ApiError);
  });

  it("gets health status", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: "ok" }),
    });

    await expect(getHealthStatus()).resolves.toEqual({ status: "ok" });
  });
});