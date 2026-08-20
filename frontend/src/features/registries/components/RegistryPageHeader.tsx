import { Plus, X, type LucideIcon } from "lucide-react";

interface RegistryPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  activeCount: number;
  activeLabel: string;
  formOpen: boolean;
  onToggleForm: () => void;
  readOnly?: boolean;
}

export function RegistryPageHeader({ eyebrow, title, description, icon: Icon, count, activeCount, activeLabel, formOpen, onToggleForm, readOnly = false }: RegistryPageHeaderProps) {
  return (
    <>
      <div className="registry-heading">
        <div><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
        {!readOnly && <button className={formOpen ? "registry-add-button is-cancel" : "registry-add-button"} type="button" onClick={onToggleForm}>
          {formOpen ? <X size={17} /> : <Plus size={17} />}{formOpen ? "Fechar cadastro" : "Novo cadastro"}
        </button>}
      </div>
      <div className="registry-overview">
        <div className="registry-overview-icon"><Icon size={20} /></div>
        <div><span>Total cadastrado</span><strong>{count}</strong></div>
        <i />
        <div><span>{activeLabel}</span><strong>{activeCount}</strong></div>
      </div>
    </>
  );
}
