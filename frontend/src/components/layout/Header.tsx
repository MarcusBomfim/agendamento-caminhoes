import { Bell, CircleHelp, Menu } from "lucide-react";
import { useLocation } from "react-router";
import { useAuth } from "../../features/auth/useAuth";

interface HeaderProps {
  onOpenMenu: () => void;
}

const pageInformation = [
  { path: "/agendamentos/novo", title: "Novo agendamento", eyebrow: "PLANEJAMENTO" },
  { path: "/agendamentos", title: "Agendamentos", eyebrow: "OPERAÇÃO" },
  { path: "/motoristas", title: "Motoristas", eyebrow: "CADASTROS" },
  { path: "/veiculos", title: "Veículos", eyebrow: "CADASTROS" },
  { path: "/terminais", title: "Terminais", eyebrow: "CONFIGURAÇÕES" },
  { path: "/dashboard", title: "Visão geral", eyebrow: "DASHBOARD" },
];

export function Header({ onOpenMenu }: HeaderProps) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const currentPage = pageInformation.find((page) => pathname.startsWith(page.path))
    ?? pageInformation[pageInformation.length - 1];
  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="header-title-group">
        <button className="menu-button" type="button" onClick={onOpenMenu} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <div><span>{currentPage.eyebrow}</span><h1>{currentPage.title}</h1></div>
      </div>

      <div className="header-actions">
        <p className="current-date">{currentDate}</p>
        <span className={`operation-status ${user?.role === "VIEWER" ? "is-viewer" : ""}`}><i /> {user?.role === "VIEWER" ? "Somente leitura" : "Operação online"}</span>
        <button type="button" aria-label="Ajuda"><CircleHelp size={20} /></button>
        <button className="notification-button" type="button" aria-label="Notificações">
          <Bell size={20} /><span aria-hidden="true">3</span>
        </button>
      </div>
    </header>
  );
}
