import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// stub auth hook and favorites storage
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { email: "test@example.com", role: 0 }, logoutUser: vi.fn() }),
}));
vi.mock("@/lib/feedback/storage", () => ({
  getFavorites: () => [{ businessId: "1" }, { businessId: "2" }],
}));

import NavbarAuth from "./NavbarAuth";

describe("NavbarAuth", () => {
  it("shows favorites link with count badge", () => {
    const { getByText } = render(<NavbarAuth />);
    // there should be "Favorites" text and a badge with number 2
    expect(getByText(/Favorites/)).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
  });
});
