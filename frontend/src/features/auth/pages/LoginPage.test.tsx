import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { AuthContext, type AuthContextValue } from "../AuthContext";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("envia as credenciais preenchidas para autenticação", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue(undefined);
    const auth: AuthContextValue = {
      user: null,
      authenticated: false,
      login,
      logout: vi.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={auth}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    const email = screen.getByLabelText("E-mail");
    const password = screen.getByLabelText("Senha");

    await user.clear(email);
    await user.type(email, "operador@portoagenda.com");
    await user.clear(password);
    await user.type(password, "Senha@123");
    await user.click(screen.getByRole("button", { name: /entrar no sistema/i }));

    expect(login).toHaveBeenCalledWith("operador@portoagenda.com", "Senha@123");
  });
});
