import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { apiRequest } from "../../../services/apiClient";
import { strongPasswordSchema } from "../../users/schemas/userSchema";
import { AuthPageShell } from "../components/AuthPageShell";

interface ResetResponse { message: string }

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<ResetResponse | null>(null);
  const [error, setError] = useState(token ? "" : "O link de recuperação está incompleto.");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const passwordResult = strongPasswordSchema.safeParse(password);
    if (!passwordResult.success) { setError(passwordResult.error.issues[0]?.message ?? "Senha inválida"); return; }
    if (password !== confirmation) { setError("As senhas não coincidem"); return; }
    if (!token) return;
    setSubmitting(true);
    setError("");
    try { setResult(await apiRequest<ResetResponse>("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) })); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Não foi possível redefinir a senha"); }
    finally { setSubmitting(false); }
  };

  return (
    <AuthPageShell>
      <form onSubmit={submit}><span className="login-eyebrow">NOVA SENHA</span><h2>Redefina sua senha</h2><p>Crie uma nova senha forte. O link deixará de funcionar depois da alteração.</p>
        {!result && <>
          <label><span>Nova senha</span><div><LockKeyhole size={17} /><input autoFocus type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /><button className="login-show-password" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
          <label><span>Confirmar nova senha</span><div><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" required /></div></label>
          <div className="login-password-rules">Use 10 caracteres ou mais, com letra maiúscula, minúscula, número e caractere especial.</div>
        </>}
        {error && <div className="login-error" role="alert">{error}</div>}
        {result && <div className="login-success" role="status"><strong>Senha alterada</strong><span>{result.message}</span></div>}
        {!result && <button type="submit" disabled={submitting || !token}>{submitting ? "Alterando..." : <>Redefinir senha <ArrowRight size={17} /></>}</button>}
        <Link className="login-back-link" to="/login"><ArrowLeft size={15} /> {result ? "Entrar com a nova senha" : "Voltar para o login"}</Link>
      </form>
    </AuthPageShell>
  );
}
