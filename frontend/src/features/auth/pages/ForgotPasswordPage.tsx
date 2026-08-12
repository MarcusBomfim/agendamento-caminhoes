import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { apiRequest } from "../../../services/apiClient";
import { AuthPageShell } from "../components/AuthPageShell";

interface RecoveryResponse { message: string; resetUrl?: string }

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<RecoveryResponse | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try { setResult(await apiRequest<RecoveryResponse>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Não foi possível solicitar a recuperação"); }
    finally { setSubmitting(false); }
  };

  return (
    <AuthPageShell>
      <form onSubmit={submit}><span className="login-eyebrow">RECUPERAÇÃO DE ACESSO</span><h2>Esqueceu sua senha?</h2><p>Informe seu e-mail corporativo para receber um link temporário de redefinição.</p>
        {!result && <label><span>E-mail</span><div><Mail size={17} /><input autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div></label>}
        {error && <div className="login-error" role="alert">{error}</div>}
        {result && <div className="login-success" role="status"><strong>Solicitação recebida</strong><span>{result.message}</span></div>}
        {!result && <button type="submit" disabled={submitting}>{submitting ? "Enviando..." : <>Enviar instruções <ArrowRight size={17} /></>}</button>}
        {result?.resetUrl && <a className="local-recovery-link" href={result.resetUrl}>Abrir link de recuperação local <ArrowRight size={15} /></a>}
        <Link className="login-back-link" to="/login"><ArrowLeft size={15} /> Voltar para o login</Link>
      </form>
    </AuthPageShell>
  );
}
