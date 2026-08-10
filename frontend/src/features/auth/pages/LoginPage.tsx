import { Anchor, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function LoginPage() {
  return (
    <main className="login-placeholder">
      <span className="login-logo" aria-hidden="true"><Anchor size={28} /></span>
      <span className="login-eyebrow">PORTO AGENDA</span>
      <h1>Acesso operacional</h1>
      <p>A autenticação por perfil será implementada junto com a API e o banco de dados.</p>
      <Link to="/dashboard">Acessar demonstração <ArrowRight size={18} /></Link>
    </main>
  );
}

