"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "../../../lib/actions/admin/booking-action";

export default function CancelBookingBtn({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [pending, setTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    setTransition(async () => {
      const res = await cancelBooking(bookingId, "Cancelled by guest");
      if (!res.success) { setError(res.message); return; }
      router.refresh();
    });
  };

  if (!confirm) return <button onClick={() => setConfirm(true)} className="text-xs text-red-600 font-medium hover:underline">Cancel booking</button>;
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-foreground/60">Are you sure?</p>
      <button onClick={handleCancel} disabled={pending} className="text-xs text-red-600 font-semibold hover:underline disabled:opacity-60">{pending ? "Cancelling..." : "Yes, cancel"}</button>
      <button onClick={() => setConfirm(false)} className="text-xs hover:underline">No, keep it</button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}