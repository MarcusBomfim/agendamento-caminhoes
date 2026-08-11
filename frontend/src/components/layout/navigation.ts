import {
  CalendarDays,
  CalendarPlus,
  LayoutDashboard,
  Truck,
  UserCog,
  UsersRound,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
  adminOnly?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Agendamentos", path: "/agendamentos", icon: CalendarDays, end: true },
  { label: "Novo agendamento", path: "/agendamentos/novo", icon: CalendarPlus },
  { label: "Motoristas", path: "/motoristas", icon: UsersRound },
  { label: "Veículos", path: "/veiculos", icon: Truck },
  { label: "Terminais", path: "/terminais", icon: Warehouse },
  { label: "Usuários", path: "/usuarios", icon: UserCog, adminOnly: true },
];
