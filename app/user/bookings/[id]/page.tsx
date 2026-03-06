import { getAccessToken } from "../../../../lib/cookies";
import { BOOKING_ENDPOINTS } from "../../../../lib/api/endpoint";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getBooking(token: string, id: string) {
  try {
    const res = await fetch(BOOKING_ENDPOINTS.DETAIL(id), { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch { return null; }
}

function formatCurrency(value: unknown) {
  const amount = Number(value ?? 0);
  return `$${Number.isFinite(amount) ? amount.toLocaleString() : "0"}`;
}

function toTitle(value: unknown) {
  return String(value ?? "").replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function statusBadgeClass(status: unknown) {
  const s = String(status ?? "").toLowerCase();
  if (["confirmed", "checked_in", "checked_out"].includes(s)) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
  if (["cancelled", "no_show"].includes(s)) return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
}

function paymentBadgeClass(status: unknown) {
  const s = String(status ?? "").toLowerCase();
  if (s === "paid") return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
  if (s === "refunded") return "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300";
  return "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300";
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getAccessToken();
  if (!token) return notFound();
  const booking = await getBooking(token, id);
  if (!booking) return notFound();

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Number(booking.nights ?? 0);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-white/80 text-sm">Booking Reference</p>
            <h1 className="text-3xl font-bold tracking-tight">{booking.bookingReference}</h1>
            <p className="text-white/85 text-sm">{booking.hotel?.name ?? "Hotel"} · {booking.room?.name ?? booking.room?.roomNumber ?? "Room"}</p>
          </div>
          <Link href="/user/bookings" className="text-sm font-semibold rounded-md bg-white/20 hover:bg-white/30 px-3 py-1.5 transition-colors">← Back to Bookings</Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(booking.status)}`}>{toTitle(booking.status)}</span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${paymentBadgeClass(booking.paymentStatus)}`}>{toTitle(booking.paymentStatus)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Stay Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ["Hotel", booking.hotel?.name ?? "—"],
              ["Room", booking.room?.name ?? booking.room?.roomNumber ?? "—"],
              ["Check-in", checkIn.toLocaleDateString()],
              ["Check-out", checkOut.toLocaleDateString()],
              ["Nights", nights],
              ["Guests", `${booking.adults} adults, ${booking.children} children`],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-black/10 dark:border-white/10 bg-background/80 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-foreground/50">{label}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-white/5 backdrop-blur-sm p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Price Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-medium">{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Taxes</span>
              <span className="font-medium">{formatCurrency(booking.taxes)}</span>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-3 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {booking.specialRequests && (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-5">
          <p className="text-sm font-semibold mb-2">Special Requests</p>
          <p className="text-sm text-foreground/70 leading-relaxed">{booking.specialRequests}</p>
        </div>
      )}
    </div>
  );
}
