"use client";
import { useAuth } from "../../../context/authcontext";
import ThemeToggle from "../../_components/themetoggle";
export default function AdminHeader() {
  const { user, logout } = useAuth();
  return (
    <header className="h-14 border-b border-black/10 dark:border-white/10 px-6 flex items-center justify-between">
      <span className="text-sm text-foreground/60">Welcome, <strong>{user?.firstName ?? "Admin"}</strong> · <span className="capitalize">{user?.role}</span></span>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button onClick={logout} className="text-sm font-semibold hover:underline text-red-600">Logout</button>
      </div>
    </header>
  );
}