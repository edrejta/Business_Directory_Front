import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// next/navigation isn't available in the test environment, so stub it.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
// avoid calling the real NavbarAuth which depends on AuthContext
vi.mock("./NavbarAuth", () => ({ default: () => <div data-testid="nav-auth" /> }));

import Navbar from "./Navbar";
import { AuthProvider } from "@/context/AuthContext";

describe("Navbar", () => {
  it("renders Home and About links", () => {
    const { getByRole } = render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    const homeLink = getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    const aboutLink = getByRole("link", { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });
});
