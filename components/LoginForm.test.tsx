import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("renders Email and Password inputs and Hyr button", () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    const password = screen.getByPlaceholderText("••••••••");
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /hyr/i })).toBeInTheDocument();
  });

  it("calls onSubmit with email and password on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123");
    await user.click(screen.getByRole("button", { name: /hyr/i }));
    expect(onSubmit).toHaveBeenCalledWith({ email: "test@example.com", password: "secret123" });
  });

  it("shows error when error prop is set", () => {
    render(
      <LoginForm onSubmit={vi.fn()} error="Email ose fjalëkalim i gabuar." />
    );
    expect(screen.getByText("Email ose fjalëkalim i gabuar.")).toBeInTheDocument();
  });

  it("when isLoading=true button is disabled and shows loading text", () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading />);
    const btn = screen.getByRole("button", { name: /duke u ngarkuar|hyr/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/duke u ngarkuar/i);
  });
});
