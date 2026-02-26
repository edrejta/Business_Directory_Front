import { render } from "@testing-library/react";
import * as rtl from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
  it("renders Username, Email, Password and Regjistrohu button", () => {
    const { getByLabelText, getByPlaceholderText, getByRole } = render(
      <RegisterForm onSubmit={vi.fn()} />
    );
    expect(getByLabelText("Emri i përdoruesit")).toBeInTheDocument();
    expect(getByLabelText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(getByRole("button", { name: /regjistrohu/i })).toBeInTheDocument();
  });

  it("calls onSubmit with username, email, password, role on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { getByLabelText, getByPlaceholderText, getByRole } = render(
      <RegisterForm onSubmit={onSubmit} />
    );
    await user.type(getByLabelText("Emri i përdoruesit"), "johndoe");
    await user.type(getByLabelText("Email"), "john@example.com");
    await user.type(getByPlaceholderText("••••••••"), "password123");
    await user.click(getByRole("button", { name: /regjistrohu/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      role: 0,
    });
  });

  it("shows error when error prop is set", () => {
    render(
      <RegisterForm
        onSubmit={vi.fn()}
        error="Një përdorues me këtë email ekziston tashmë."
      />
    );
    const { getByText } = render(
      <RegisterForm
        onSubmit={vi.fn()}
        error="Një përdorues me këtë email ekziston tashmë."
      />
    );
    expect(getByText("Një përdorues me këtë email ekziston tashmë.")).toBeInTheDocument();
  });

  it("when isLoading=true button is disabled", () => {
    const { getByRole } = render(<RegisterForm onSubmit={vi.fn()} isLoading />);
    const btn = getByRole("button", { name: /duke u ngarkuar|regjistrohu/i });
    expect(btn).toBeDisabled();
  });
});
