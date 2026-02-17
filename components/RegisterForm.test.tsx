import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
  it("renders Username, Email, Roli, Password and Regjistrohu button", () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText("Emri i përdoruesit")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Roli")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /regjistrohu/i })).toBeInTheDocument();
  });

  it("calls onSubmit with username, email, password, role on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Emri i përdoruesit"), "johndoe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: /regjistrohu/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      role: 0,
    });
  });

  it("submits role 1 when Pronar Biznesi is selected", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);
    await user.selectOptions(screen.getByLabelText("Roli"), "1");
    await user.type(screen.getByLabelText("Emri i përdoruesit"), "owner");
    await user.type(screen.getByLabelText("Email"), "owner@test.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: /regjistrohu/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ role: 1 })
    );
  });

  it("shows error when error prop is set", () => {
    render(
      <RegisterForm
        onSubmit={vi.fn()}
        error="Një përdorues me këtë email ekziston tashmë."
      />
    );
    expect(
      screen.getByText("Një përdorues me këtë email ekziston tashmë.")
    ).toBeInTheDocument();
  });

  it("when isLoading=true button is disabled", () => {
    render(<RegisterForm onSubmit={vi.fn()} isLoading />);
    const btn = screen.getByRole("button", { name: /duke u ngarkuar|regjistrohu/i });
    expect(btn).toBeDisabled();
  });
});
