import type { ReactNode } from "react";
import { Save, X } from "lucide-react";

export function RegistryFormPanel({ title, description, onCancel, children }: { title: string; description: string; onCancel: () => void; children: ReactNode }) {
  return (
    <div className="registry-form-panel">
      <header><div><span>NOVO REGISTRO</span><h3>{title}</h3><p>{description}</p></div><button type="button" onClick={onCancel} aria-label="Fechar formulário"><X size={18} /></button></header>
      {children}
    </div>
  );
}

export function RegistryFormActions({ onCancel, submitting }: { onCancel: () => void; submitting: boolean }) {
  return (
    <footer className="registry-form-actions"><button type="button" onClick={onCancel}>Cancelar</button><button className="registry-submit" type="submit" disabled={submitting}><Save size={16} /> Salvar cadastro</button></footer>
  );
}

export function RegistryFieldError({ message }: { message?: string }) {
  return message ? <span className="registry-field-error">{message}</span> : null;
}
