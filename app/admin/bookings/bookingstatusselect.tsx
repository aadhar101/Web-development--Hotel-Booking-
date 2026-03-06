"use client";
import { useState, useTransition } from "react";
import { updateBookingStatus } from "../../../lib/actions/admin/booking-action";
const STATUSES = ["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"];
export default function BookingStatusSelect({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [pending, setTransition] = useTransition();
  const handle = (newStatus: string) => {
    setTransition(async () => { const res = await updateBookingStatus(bookingId, newStatus); if (res.success) setStatus(newStatus); });
  };
  return (
    <select value={status} onChange={e=>handle(e.target.value)} disabled={pending}
      className={`rounded-md border px-2 py-1 text-xs font-medium capitalize outline-none disabled:opacity-60 ${status==="confirmed"?"border-green-500 text-green-700":status==="pending"?"border-yellow-500 text-yellow-700":status==="cancelled"?"border-red-500 text-red-700":"border-black/10 text-foreground"}`}>
      {STATUSES.map(s=><option key={s} value={s} className="capitalize">{s.replace("_"," ")}</option>)}
    </select>
  );
}
