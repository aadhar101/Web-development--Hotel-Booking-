import { getMyBookings } from "../../../lib/actions/admin/booking-action";
import Link from "next/link";
import CancelBookingBtn from "./cancelbookingbtn";

export const metadata = { title: "My Bookings" };

export default async function MyBookingsPage() {
  const result = await getMyBookings();
  const bookings: any[] = Array.isArray(result.data) ? result.data : [];
  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-white/5 p-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-sm text-foreground/60 mt-1">See current reservations, status, and payment progress.</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 px-4 py-3 text-left">
            <p className="text-xs text-foreground/60">Total Bookings</p><p className="text-xl font-bold">{total}</p>
          </button>
          <button className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/80 dark:bg-green-900/20 px-4 py-3 text-left">
            <p className="text-xs text-foreground/60">Confirmed</p><p className="text-xl font-bold text-green-700 dark:text-green-300">{confirmed}</p>
          </button>
          <button className="rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50/80 dark:bg-yellow-900/20 px-4 py-3 text-left">
            <p className="text-xs text-foreground/60">Pending</p><p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{pending}</p>
          </button>
        </div>
      </section>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/20 dark:border-white/20 text-center py-12 space-y-3 bg-white/65 dark:bg-white/5">
          <p className="text-foreground/60">No bookings found.</p>
          <Link href="/hotels" className="inline-block px-6 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90">Browse Hotels</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-white/5 p-5 space-y-3 backdrop-blur-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold">{b.hotel?.name ?? "Hotel"}</p>
                  <p className="text-sm text-foreground/60">Room: {b.room?.name ?? b.room?.roomNumber}</p>
                  <p className="text-sm text-foreground/60">Ref: {b.bookingReference}</p>
                  <p className="text-sm text-foreground/60">{new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()} · {b.nights} night{b.nights > 1 ? "s" : ""}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <span className={`block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : b.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{b.status}</span>
                  <span className={`block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${b.paymentStatus === "paid" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{b.paymentStatus}</span>
                  <p className="font-bold">${b.totalAmount}</p>
                </div>
              </div>
              {(b.status === "pending" || b.status === "confirmed") && (
                <CancelBookingBtn bookingId={b._id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
