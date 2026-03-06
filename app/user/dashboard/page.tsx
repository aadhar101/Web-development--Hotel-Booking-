import { getMyBookings } from "../../../lib/actions/admin/booking-action";
import Link from "next/link";

export const metadata = { title: "My Dashboard" };

export default async function UserDashboardPage() {
  const result = await getMyBookings();
  const bookings: any[] = Array.isArray(result.data) ? result.data : [];
  const recentBookings = bookings.slice(0, 5);
  const totalSpent = bookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/40 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <p className="text-sm text-white/80">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold">My Dashboard</h1>
        <p className="mt-2 text-sm text-white/90">Track bookings, update your profile, and plan your next stay with confidence.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/hotels" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-white/90">Book a Hotel</Link>
          <Link href="/user/profile" className="rounded-md border border-white/50 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Edit Profile</Link>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length },
          { label: "Confirmed",      value: bookings.filter((b) => b.status === "confirmed").length },
          { label: "Pending",        value: bookings.filter((b) => b.status === "pending").length },
          { label: "Total Spent",     value: `$${totalSpent.toFixed(0)}` },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur">
            <p className="text-sm text-foreground/60">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>
        <Link href="/user/bookings" className="text-sm font-semibold hover:underline">View all →</Link>
      </div>
      {recentBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/20 dark:border-white/20 bg-white/60 dark:bg-white/5 text-center py-12 space-y-3">
          <p className="text-foreground/60">No bookings yet. Start with a place you’ll love.</p>
          <Link href="/hotels" className="inline-block px-6 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90">Browse Hotels</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentBookings.map((b) => (
            <Link key={b._id} href={`/user/bookings/${b._id}`} className="block rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{b.hotel?.name ?? "Hotel"}</p>
                  <p className="text-sm text-foreground/60">Ref: {b.bookingReference} · {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : b.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{b.status}</span>
                  <p className="text-sm font-semibold mt-1">${b.totalAmount}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
