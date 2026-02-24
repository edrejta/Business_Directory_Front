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
          data: [{ Id: "b1", Name: "Cafe Uno", City: "Tirana", Type: "Cafe" }],
        }),
    });

    const result = await getApprovedBusinesses({ search: "cafe", city: "Tirana", type: "Cafe" });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/businesses/public?search=cafe&city=Tirana&type=Cafe`,
      expect.anything(),
    );
    expect(result).toEqual([
      {
        id: "b1",
        name: "Cafe Uno",
        city: "Tirana",
        businessType: "Cafe",
        status: undefined,
        description: undefined,
        ownerId: undefined,
      },
    ]);
  });

  it("gets business by id", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            { id: "x1", name: "Bakery 21", city: "Prishtina" },
            { id: "x2", name: "Cafe 22", city: "Prizren" },
          ],
        }),
    });

    const result = await getApprovedBusinessById("x1");
    expect(result.id).toBe("x1");
    expect(result.name).toBe("Bakery 21");
  });

  it("throws ApiError on not found business payload", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [{ id: "x1", name: "Bakery 21" }] }),
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
