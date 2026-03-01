import { describe, expect, it, vi } from "vitest";
import {
  BUSINESS_ID_MISSING_MESSAGE,
  UNABLE_TO_REACH_BACKEND_MESSAGE,
} from "@/lib/constants/messages";
import { fetchOpenDaysForBusiness, resolveRequestedBusinessId } from "@/lib/api/openDays";

describe("resolveRequestedBusinessId", () => {
  it("prefers businessId and trims spaces", () => {
    expect(resolveRequestedBusinessId({ businessId: "  abc  ", id: "zzz" })).toBe("abc");
  });

  it("falls back to id when businessId is missing", () => {
    expect(resolveRequestedBusinessId({ id: "  xyz  " })).toBe("xyz");
  });

  it("returns undefined when params are empty", () => {
    expect(resolveRequestedBusinessId({})).toBeUndefined();
  });
});

describe("fetchOpenDaysForBusiness", () => {
  it("returns a clear error when business id is missing", async () => {
    const result = await fetchOpenDaysForBusiness(undefined, vi.fn());
    expect(result).toEqual({ data: null, errorMessage: BUSINESS_ID_MISSING_MESSAGE });
  });

  it("falls back to owner endpoint when first endpoint fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Not found" }), {
          status: 404,
          statusText: "Not Found",
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            businessId: "b1",
            mondayOpen: true,
            tuesdayOpen: true,
            wednesdayOpen: true,
            thursdayOpen: true,
            fridayOpen: true,
            saturdayOpen: false,
            sundayOpen: false,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

    const result = await fetchOpenDaysForBusiness("b1", fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/opendays?businessId=b1");
    expect(String(fetchMock.mock.calls[1][0])).toContain("/api/opendays/owner?businessId=b1");
    expect(result.errorMessage).toBeNull();
    expect(result.data?.businessId).toBe("b1");
    expect(result.data?.mondayOpen).toBe(true);
  });

  it("returns network error when both attempts fail to reach backend", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));

    const result = await fetchOpenDaysForBusiness("b1", fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ data: null, errorMessage: UNABLE_TO_REACH_BACKEND_MESSAGE });
  });
});
