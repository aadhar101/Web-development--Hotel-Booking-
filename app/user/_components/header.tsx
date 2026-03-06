"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/authcontext";
import ThemeToggle from "../../_components/themetoggle";
export default function UserHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const profileLabel = user?.firstName?.trim() || user?.email?.split("@")[0] || "Profile";
  const linkCls = (href: string) =>
    `rounded-md px-3 py-1.5 transition-all ${
      pathname === href || (href !== "/" && pathname.startsWith(href))
        ? "bg-blue-600 text-white shadow-sm"
        : "text-foreground/80 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
    }`;
  return (
    <header className="h-16 border-b border-black/10 dark:border-white/10 px-6 flex items-center justify-between bg-white/70 dark:bg-black/20 backdrop-blur-md">
      <Link href="/" className="font-bold text-lg tracking-wide">🏨 HotelBook</Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/user/dashboard" className={linkCls("/user/dashboard")}>Dashboard</Link>
        <Link href="/user/bookings" className={linkCls("/user/bookings")}>My Bookings</Link>
        <Link href="/user/profile" className={linkCls("/user/profile")}>{profileLabel}</Link>
        <ThemeToggle />
        <button onClick={logout} className="font-semibold hover:underline text-red-600">Logout</button>
      </nav>
    </header>
  );
}
