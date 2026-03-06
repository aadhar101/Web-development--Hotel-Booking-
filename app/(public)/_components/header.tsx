"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/authcontext";
import ThemeToggle from "../../_components/themetoggle";

export default function PublicHeader() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const pathname = usePathname();
  const linkCls = (href: string) =>
    `rounded-md px-3 py-1.5 transition-all ${
      pathname === href || (href !== "/" && pathname.startsWith(href))
        ? "bg-white/20 text-white"
        : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header className="h-16 border-b border-white/20 px-6 flex items-center justify-between backdrop-blur-md bg-black/20">
      <Link href="/" className="font-bold text-lg text-white tracking-wide">🏨 HotelBook</Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/hotels" className={linkCls("/hotels")}>Hotels</Link>
        <Link href="/about" className={linkCls("/about")}>About</Link>
        {isAuthenticated ? (
          <>
            {isAdmin && <Link href="/admin" className={linkCls("/admin")}>Admin</Link>}
            <Link href="/user/dashboard" className={linkCls("/user")}>{user?.firstName ?? "Dashboard"}</Link>
          </>
        ) : (
          <>
            <Link href="/login" className={linkCls("/login")}>Login</Link>
            <Link href="/register" className="px-4 py-1.5 rounded-md bg-white text-black font-semibold hover:opacity-90 transition-opacity">Sign up</Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
