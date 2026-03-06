"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/authcontext";
import { createBooking } from "../../../lib/actions/admin/booking-action";

interface Room {
  _id?: string;
  id?: string;
  roomId?: string;
  name: string;
  price: number;
  discountPrice?: number;
}

export default function BookingForm({ hotelId, room }: { hotelId: string; room: Room }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    paymentMethod: "stripe",
  });

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;
  const pricePerNight = room.discountPrice ?? room.price;
  const total = nights * pricePerNight;

  const normalizeDate = (date: string) => new Date(`${date}T12:00:00.000Z`).toISOString();

  const handleBook = () => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) { 
      router.push(`/login?next=/hotels/${hotelId}`);
      return; 
    }
    if (!form.checkIn || !form.checkOut || nights < 1) { 
      setError("Please select valid dates"); 
      return; 
    }
    setError(null);
    setTransition(async () => {
      try {
        const roomIdentifier = room._id ?? room.id ?? room.roomId;
        if (!roomIdentifier) {
          setError("Room identifier is missing. Please refresh and try again.");
          return;
        }

        const res = await createBooking({
          hotel: hotelId,
          hotelId,
          room: roomIdentifier,
          roomId: roomIdentifier,
          checkIn: normalizeDate(form.checkIn),
          checkOut: normalizeDate(form.checkOut),
          adults: form.adults, children: form.children,
          specialRequests: form.specialRequests,
          paymentMethod: form.paymentMethod,
          guestInfo: { firstName: user?.firstName, lastName: user?.lastName, email: user?.email, phone: user?.phone || "" },
        });
        if (!res.success) throw new Error(res.message || "Booking failed");
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/user/bookings";
        }, 2000);
      } catch (err: unknown) { 
        setError(err instanceof Error ? err.message : "Booking failed"); 
      }
    });
  };

  if (success) return <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">Booking confirmed! Redirecting...</div>;

  return (
    <div className="mt-3 space-y-2 text-left">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-foreground/60">Check-in</label>
          <input type="date" min={new Date().toISOString().split("T")[0]} value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            className="h-9 w-full rounded-md border border-black/10 bg-background px-2 text-sm outline-none" />
        </div>
        <div>
          <label className="text-xs text-foreground/60">Check-out</label>
          <input type="date" min={form.checkIn || new Date().toISOString().split("T")[0]} value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            className="h-9 w-full rounded-md border border-black/10 bg-background px-2 text-sm outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-foreground/60">Adults</label>
          <select value={form.adults} onChange={(e) => setForm({ ...form, adults: +e.target.value })}
            className="h-9 w-full rounded-md border border-black/10 bg-background px-2 text-sm outline-none">
            {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-foreground/60">Children</label>
          <select value={form.children} onChange={(e) => setForm({ ...form, children: +e.target.value })}
            className="h-9 w-full rounded-md border border-black/10 bg-background px-2 text-sm outline-none">
            {[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      {nights > 0 && <p className="text-xs text-foreground/60">{nights} night{nights > 1 ? "s" : ""} · Total: <strong>${total}</strong></p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button onClick={handleBook} disabled={pending || isLoading}
        className="h-9 w-full rounded-md bg-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60">
        {pending ? "Booking..." : isLoading ? "Checking session..." : isAuthenticated ? "Book Now" : "Login to Book"}
      </button>
    </div>
  );
}
