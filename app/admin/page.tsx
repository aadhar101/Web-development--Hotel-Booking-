import { getAdminDashboard } from "../../lib/actions/admin/user-action";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const result = await getAdminDashboard();
  const overview = result.data?.overview ?? {};
  const recentBookings = result.data?.recentBookings ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users",     value: overview.totalUsers     ?? "—", href: "/admin/users"    },
          { label: "Total Hotels",    value: overview.totalHotels    ?? "—", href: "/admin/hotels"   },
          { label: "Total Bookings",  value: overview.totalBookings  ?? "—", href: "/admin/bookings" },
          { label: "Revenue (Month)", value: overview.revenueThisMonth ? `$${overview.revenueThisMonth}` : "—", href: "/admin/bookings" },
        ].map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-black/10 dark:border-white/10 p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <p className="text-sm text-foreground/60">{c.label}</p>
            <p className="mt-1 text-2xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5"><h2 className="font-semibold mb-1">Pending Bookings</h2><p className="text-3xl font-bold">{overview.pendingBookings ?? "—"}</p></div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5"><h2 className="font-semibold mb-1">Reviews Pending</h2><p className="text-3xl font-bold">{overview.reviewsPending ?? "—"}</p></div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5"><h2 className="font-semibold mb-1">Active Users</h2><p className="text-3xl font-bold">{overview.activeUsers ?? "—"}</p></div>
      </div>
      {recentBookings.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Recent Bookings</h2>
          <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-black/10 dark:border-white/10">{["Reference","Guest","Hotel","Amount","Status"].map(h => <th key={h} className="px-4 py-3 text-left font-medium text-foreground/60">{h}</th>)}</tr></thead>
              <tbody>{recentBookings.map((b: any) => (
                <tr key={b._id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{b.bookingReference}</td>
                  <td className="px-4 py-3">{b.guestInfo?.firstName} {b.guestInfo?.lastName}</td>
                  <td className="px-4 py-3">{b.hotel?.name}</td>
                  <td className="px-4 py-3 font-semibold">${b.totalAmount}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{b.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}