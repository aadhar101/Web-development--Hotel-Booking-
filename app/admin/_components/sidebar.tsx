"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/admin",           label: "📊 Dashboard" },
  { href: "/admin/users",     label: "👥 Users"     },
  { href: "/admin/hotels",    label: "🏨 Hotels"    },
  { href: "/admin/bookings",  label: "📋 Bookings"  },
  { href: "/admin/reviews",   label: "⭐ Reviews"   },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 border-r border-black/10 dark:border-white/10 min-h-screen p-4 flex flex-col gap-1">
      <div className="mb-6 px-2 text-lg font-bold">Hotel Admin</div>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href)) ? "bg-foreground text-background" : "hover:bg-black/5 dark:hover:bg-white/5"}`}>
          {link.label}
        </Link>
      ))}
    </aside>
  );
}