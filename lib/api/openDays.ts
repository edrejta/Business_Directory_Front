import { API_URL } from "@/lib/api/config";
import {
  BUSINESS_ID_MISSING_MESSAGE,
  OPEN_DAYS_NOT_AVAILABLE_MESSAGE,
  UNABLE_TO_REACH_BACKEND_MESSAGE,
} from "@/lib/constants/messages";

export type OpenDays = {
  businessId: string;
  mondayOpen: boolean;
  tuesdayOpen: boolean;
  wednesdayOpen: boolean;
  thursdayOpen: boolean;
  fridayOpen: boolean;
  saturdayOpen: boolean;
  sundayOpen: boolean;
};

export type OpenDaysResult = {
  data: OpenDays | null;
  errorMessage: string | null;
};

type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type OpenDaysParams = {
  businessId?: string;
  id?: string;
};

export const OPEN_DAYS_ENDPOINTS = ["/api/opendays", "/api/opendays/owner"] as const;

export function resolveRequestedBusinessId(params: OpenDaysParams): string | undefined {
  const businessId = params.businessId?.trim() || params.id?.trim();
  return businessId || undefined;
}

/**
 * Fetches open-days data for a business using endpoint fallback.
 * It tries the public endpoint first, then owner endpoint for compatibility.
 */
export async function fetchOpenDaysForBusiness(
  businessId: string | undefined,
  fetchFn: FetchFn = fetch,
): Promise<OpenDaysResult> {
  if (!businessId?.trim()) {
    return { data: null, errorMessage: BUSINESS_ID_MISSING_MESSAGE };
  }

  const normalizedBusinessId = businessId.trim();
  let lastErrorMessage: string | null = null;

  // Try public endpoint first; if unavailable, fallback to owner endpoint.
  for (const endpoint of OPEN_DAYS_ENDPOINTS) {
    try {
      const response = await fetchFn(`${API_URL}${endpoint}?businessId=${encodeURIComponent(normalizedBusinessId)}`, {
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => ({}))) as OpenDays & { message?: string };

      if (!response.ok) {
        lastErrorMessage = payload.message?.trim() || response.statusText || OPEN_DAYS_NOT_AVAILABLE_MESSAGE;
        continue;
      }

      return { data: payload, errorMessage: null };
    } catch {
      lastErrorMessage = UNABLE_TO_REACH_BACKEND_MESSAGE;
    }
  }

  return { data: null, errorMessage: lastErrorMessage || OPEN_DAYS_NOT_AVAILABLE_MESSAGE };
}
