import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { ResetPasswordPage } from "./ResetPasswordPage";

describe("ResetPasswordPage", () => {
  it("informa quando o link não contém um token", () => {
    render(<MemoryRouter><ResetPasswordPage /></MemoryRouter>);
    expect(screen.getByRole("alert")).toHaveTextContent("link de recuperação está incompleto");
  });

  it("recusa uma nova senha fraca antes de chamar a API", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[`/redefinir-senha?token=${"a".repeat(64)}`]}><ResetPasswordPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Nova senha"), "fraca");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "fraca");
    await user.click(screen.getByRole("button", { name: /redefinir senha/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Use no mínimo 10 caracteres");
  });
});
