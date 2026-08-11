import { Anchor, ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ApiError } from "../../../services/apiClient";
import { useAuth } from "../useAuth";

export function LoginPage() {
  const { authenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@portoagenda.com");
  const [password, setPassword] = useState("Porto@123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      const destination = (location.state as { from?: string } | null)?.from ?? "/dashboard";
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof ApiError ? loginError.message : "Não foi possível acessar o sistema");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel"><div><span className="login-brand-icon"><Anchor size={27} /></span><strong>PORTO AGENDA</strong></div><div className="login-message"><span>GESTÃO PORTUÁRIA</span><h1>Operações mais organizadas começam aqui.</h1><p>Controle agendamentos, motoristas, veículos e terminais em um único ambiente seguro.</p></div><small>Porto de Santos · Ambiente operacional</small></section>
      <section className="login-form-panel"><form onSubmit={submit}><span className="login-eyebrow">ACESSO RESTRITO</span><h2>Entre na sua conta</h2><p>Use suas credenciais de operador para continuar.</p>
        <label><span>E-mail</span><div><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div></label>
        <label><span>Senha</span><div><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={8} /></div></label>
        {error && <div className="login-error" role="alert">{error}</div>}
        <button type="submit" disabled={submitting}>{submitting ? "Entrando..." : <>Entrar no sistema <ArrowRight size={17} /></>}</button>
        <div className="demo-credentials"><strong>Acesso demonstrativo</strong><span>admin@portoagenda.com · Porto@123</span></div>
      </form></section>
    </main>
  );
}
