import { getAllBookings } from "../../../lib/actions/admin/booking-action";
import BookingStatusSelect from "./bookingstatusselect";
export const metadata = { title: "Manage Bookings" };

export default async function AdminBookingsPage() {
  const result = await getAllBookings(1, 20);
  const bookings: any[] = result.data?.data ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Bookings</h1>
      {bookings.length === 0 ? <p className="text-foreground/60">No bookings found.</p> : (
        <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-black/10">{["Reference","Guest","Hotel","Room","Dates","Amount","Payment","Status"].map(h=><th key={h} className="px-4 py-3 text-left font-medium text-foreground/60 whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>{bookings.map((b)=>(
              <tr key={b._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{b.bookingReference}</td>
                <td className="px-4 py-3 whitespace-nowrap">{b.guestInfo?.firstName} {b.guestInfo?.lastName}<br /><span className="text-xs text-foreground/50">{b.guestInfo?.email}</span></td>
                <td className="px-4 py-3">{b.hotel?.name}</td>
                <td className="px-4 py-3">{b.room?.roomNumber}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs">{new Date(b.checkIn).toLocaleDateString()} →<br />{new Date(b.checkOut).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold">${b.totalAmount}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${b.paymentStatus==="paid"?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-600"}`}>{b.paymentStatus}</span></td>
                <td className="px-4 py-3"><BookingStatusSelect bookingId={b._id} currentStatus={b.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
