import { useState } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-workspace">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <div className="page-container"><Outlet /></div>
      </div>
    </div>
  );
}

