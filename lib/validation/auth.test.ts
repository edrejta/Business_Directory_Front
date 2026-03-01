import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "./auth";

describe("registerSchema", () => {
  it("accepts valid username, email, password, role 0", () => {
    expect(
      registerSchema.safeParse({
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        role: 0,
      }).success
    ).toBe(true);
  });

  it("rejects role 1 (BusinessOwner) në signup", () => {
    const result = registerSchema.safeParse({
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      role: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects role 2 (Admin) në signup", () => {
    const result = registerSchema.safeParse({
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      role: 2,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty username", () => {
    const result = registerSchema.safeParse({
      username: "",
      email: "j@x.com",
      password: "password123",
      role: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects email without @", () => {
    const result = registerSchema.safeParse({
      username: "john",
      email: "invalidemail",
      password: "password123",
      role: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8", () => {
    const result = registerSchema.safeParse({
      username: "john",
      email: "john@example.com",
      password: "short",
      role: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "anypassword",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "notanemail",
      password: "password",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
