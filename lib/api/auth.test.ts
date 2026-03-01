import { describe, it, expect, vi, beforeEach } from "vitest";
import { register, login } from "./auth";
import { API_URL } from "./config";

describe("authApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  describe("register", () => {
    it("POSTs to /api/auth/register and returns user data", async () => {
      const mockData = {
        token: "jwt-xyz",
        id: "1",
        username: "john",
        email: "john@example.com",
        role: 0,
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await register({ username: "john", email: "john@example.com", password: "password123", role: 0 });

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/auth/register`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "john", email: "john@example.com", password: "password123", role: 0 }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("on 400 throws error with response message", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Një përdorues me këtë email ekziston tashmë." }),
      });

      await expect(
        register({ username: "j", email: "j@x.com", password: "password123", role: 0 })
      ).rejects.toThrow("Një përdorues me këtë email ekziston tashmë.");
    });
  });

  describe("login", () => {
    it("POSTs to /api/auth/login and returns user data", async () => {
      const mockData = {
        token: "jwt-abc",
        id: "2",
        username: "jane",
        email: "jane@example.com",
        role: 1,
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await login({ email: "jane@example.com", password: "secret123" });

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/auth/login`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "jane@example.com", password: "secret123" }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("on 401 throws error with message 'Email ose fjalëkalim i gabuar.'", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Email ose fjalëkalim i gabuar." }),
      });

      await expect(login({ email: "x@x.com", password: "wrong" })).rejects.toThrow(
        "Email ose fjalëkalim i gabuar."
      );
    });
  });
});
