import { Anchor } from "lucide-react";
import type { ReactNode } from "react";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div><span className="login-brand-icon"><Anchor size={27} /></span><strong>PORTO AGENDA</strong></div>
        <div className="login-message"><span>GESTÃO PORTUÁRIA</span><h1>Operações mais organizadas começam aqui.</h1><p>Controle agendamentos, motoristas, veículos e terminais em um único ambiente seguro.</p></div>
        <small>Porto de Santos · Ambiente operacional</small>
      </section>
      <section className="login-form-panel">{children}</section>
    </main>
  );
}
