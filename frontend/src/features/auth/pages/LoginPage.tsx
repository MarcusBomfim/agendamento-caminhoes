import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { ApiError } from "../../../services/apiClient";
import { AuthPageShell } from "../components/AuthPageShell";
import { useAuth } from "../useAuth";

export function LoginPage() {
  const { authenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <AuthPageShell>
      <form onSubmit={submit}><span className="login-eyebrow">ACESSO RESTRITO</span><h2>Entre na sua conta</h2><p>Use suas credenciais de operador para continuar.</p>
        <label><span>E-mail</span><div><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div></label>
        <label><span>Senha</span><div><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={8} /></div></label>
        <div className="login-password-tools"><Link to="/recuperar-senha">Esqueci minha senha</Link></div>
        {error && <div className="login-error" role="alert">{error}</div>}
        <button type="submit" disabled={submitting}>{submitting ? "Entrando..." : <>Entrar no sistema <ArrowRight size={17} /></>}</button>
      </form>
    </AuthPageShell>
  );
}
