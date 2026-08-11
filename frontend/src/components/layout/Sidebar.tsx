import { Anchor, LogOut, X } from "lucide-react";
import { NavLink } from "react-router";
import { navigationItems } from "./navigation";
import { useAuth } from "../../features/auth/useAuth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const initials = user?.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "OP";
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
          {navigationItems.filter((item) => !item.adminOnly || user?.role === "ADMIN").map(({ label, path, icon: Icon, end }) => (
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
          <div className="account-avatar" aria-hidden="true">{initials}</div>
          <div><strong>{user?.name ?? "Operador"}</strong><small>{user?.role === "ADMIN" ? "Administrador" : "Operador"}</small></div>
          <button type="button" aria-label="Sair do sistema" title="Sair" onClick={logout}><LogOut size={18} /></button>
        </div>
      </aside>
    </>
  );
}
