import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveToken, getToken, clearAuth } from "./storage";

describe("auth storage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it("saveToken saves value under token", () => {
    saveToken("xyz");
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "xyz");
  });

  it("getToken returns value from localStorage", () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("abc");
    expect(getToken()).toBe("abc");
  });

  it("getToken returns null when key does not exist", () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    expect(getToken()).toBe(null);
  });

  it("clearAuth removes token from localStorage", () => {
    clearAuth();
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });
});
