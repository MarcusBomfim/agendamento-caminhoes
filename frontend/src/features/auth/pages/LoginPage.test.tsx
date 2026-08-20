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
    const demoLogin = vi.fn().mockResolvedValue(undefined);
    const auth: AuthContextValue = {
      user: null,
      authenticated: false,
      login,
      demoLogin,
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
    expect(email).toHaveValue("");
    expect(password).toHaveValue("");
    expect(screen.queryByText("Acesso demonstrativo")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Esqueci minha senha" })).toHaveAttribute("href", "/recuperar-senha");
    expect(screen.getByRole("button", { name: /explorar como visitante/i })).toBeInTheDocument();

    await user.type(email, "operador@portoagenda.com");
    await user.type(password, "Senha@123");
    await user.click(screen.getByRole("button", { name: /entrar no sistema/i }));

    expect(login).toHaveBeenCalledWith("operador@portoagenda.com", "Senha@123");
  });

  it("inicia a demonstração sem solicitar credenciais", async () => {
    const user = userEvent.setup();
    const demoLogin = vi.fn().mockResolvedValue(undefined);
    const auth: AuthContextValue = { user: null, authenticated: false, login: vi.fn(), demoLogin, logout: vi.fn() };
    render(<MemoryRouter><AuthContext.Provider value={auth}><LoginPage /></AuthContext.Provider></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: /explorar como visitante/i }));
    expect(demoLogin).toHaveBeenCalledOnce();
  });
});
