import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import NotificationsMenu from "./NotificationsMenu";

const navigation = [
  { to: "/admin", label: "Vue d’ensemble", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projets", icon: BriefcaseBusiness },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/requests", label: "Demandes", icon: MessageSquareText },
  { to: "/admin/testimonials", label: "Témoignages", icon: Star },
  { to: "/admin/content", label: "Contenus", icon: FileText },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-brand">
          <span>
            Marius BIAOU<em>.</em>
          </span>
          <small>Administration</small>
        </div>
        <nav>
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <NavLink to="/" className="admin-back-site">
            <ChevronLeft /> Voir le portfolio
          </NavLink>
          <button type="button" onClick={logout}>
            <LogOut /> Se déconnecter
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
          <div>
            <span>ESPACE ADMINISTRATEUR</span>
            <strong>BIAOU Marius</strong>
          </div>
          <div className="admin-topbar-actions">
            <NotificationsMenu />
            <i>BM</i>
          </div>
        </header>
        <div className="admin-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
