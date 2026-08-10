import { Anchor, LogOut, X } from "lucide-react";
import { NavLink } from "react-router";
import { navigationItems } from "./navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <button
        className={`sidebar-overlay ${open ? "is-visible" : ""}`}
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "is-open" : ""}`} aria-label="Menu principal">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon" aria-hidden="true"><Anchor size={21} /></span>
          <span><strong>Porto Agenda</strong><small>Gestão portuária</small></span>
          <button className="sidebar-close" type="button" onClick={onClose} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">OPERAÇÃO</div>
        <nav className="sidebar-navigation">
          {navigationItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) => isActive ? "sidebar-link is-active" : "sidebar-link"}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-account">
          <div className="account-avatar" aria-hidden="true">OP</div>
          <div><strong>Operador Portuário</strong><small>Administrador</small></div>
          <button type="button" aria-label="Sair do sistema" title="Sair"><LogOut size={18} /></button>
        </div>
      </aside>
    </>
  );
}

