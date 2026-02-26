import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import * as rtl from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("renders Email and Password inputs and Hyr button", () => {
    const { getByLabelText, getByPlaceholderText, getByRole } = render(
      <LoginForm onSubmit={vi.fn()} />
    );
    expect(getByLabelText("Email")).toBeInTheDocument();
    const password = getByPlaceholderText("••••••••");
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute("type", "password");
    expect(getByRole("button", { name: /hyr/i })).toBeInTheDocument();
  });

  it("calls onSubmit with email and password on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { getByLabelText, getByPlaceholderText, getByRole } = render(
      <LoginForm onSubmit={onSubmit} />
    );
    await user.type(getByLabelText("Email"), "test@example.com");
    await user.type(getByPlaceholderText("••••••••"), "secret123");
    await user.click(getByRole("button", { name: /hyr/i }));
    expect(onSubmit).toHaveBeenCalledWith({ email: "test@example.com", password: "secret123" });
  });

  it("shows error when error prop is set", () => {
    const { getByText } = render(
      <LoginForm onSubmit={vi.fn()} error="Email ose fjalëkalim i gabuar." />
    );
    expect(getByText("Email ose fjalëkalim i gabuar.")).toBeInTheDocument();
  });

  it("when isLoading=true button is disabled and shows loading text", () => {
    const { getByRole } = render(<LoginForm onSubmit={vi.fn()} isLoading />);
    const btn = getByRole("button", { name: /duke u ngarkuar|hyr/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/duke u ngarkuar/i);
  });
});
