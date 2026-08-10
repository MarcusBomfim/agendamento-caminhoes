import type { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ModulePlaceholder({ eyebrow, title, description, icon: Icon }: ModulePlaceholderProps) {
  return (
    <section className="module-page">
      <div className="module-heading"><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
      <div className="module-placeholder">
        <span className="module-icon" aria-hidden="true"><Icon size={30} /></span>
        <div><strong>Módulo preparado</strong><p>As funcionalidades desta área serão implementadas nas próximas etapas.</p></div>
      </div>
    </section>
  );
}

