import { notFound } from "next/navigation";
import Link from "next/link";
import { HOTEL_ENDPOINTS } from "../../../lib/api/endpoint";
import BookingForm from "./bookingform";

async function getHotel(id: string) {
  try {
    const res = await fetch(HOTEL_ENDPOINTS.DETAIL(id), { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch { return null; }
}

async function getRooms(hotelId: string) {
  try {
    const res = await fetch(HOTEL_ENDPOINTS.ROOMS(hotelId), { cache: "no-store" });
    const data = await res.json();
    return data.data ?? [];
  } catch { return []; }
}

export default async function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [hotel, rooms] = await Promise.all([getHotel(id), getRooms(id)]);
  if (!hotel) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hotel Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <span className="text-lg shrink-0">{"⭐".repeat(hotel.starRating)}</span>
        </div>
        <p className="text-foreground/60">{hotel.address?.street}, {hotel.address?.city}, {hotel.address?.country}</p>
        <p className="text-sm leading-relaxed">{hotel.description}</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ["📞", hotel.phone],
          ["✉️", hotel.email],
          ["🏁", `Check-in: ${hotel.policies?.checkIn}`],
          ["🚪", `Check-out: ${hotel.policies?.checkOut}`],
        ].map(([icon, val]) => (
          <div key={String(val)} className="rounded-lg border border-black/10 dark:border-white/10 p-3 text-sm">
            <span className="mr-1">{icon}</span>{val}
          </div>
        ))}
      </div>

      {/* Policies */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 space-y-2">
        <h2 className="font-semibold">Policies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <span>{hotel.policies?.pets ? "✅ Pets allowed" : "❌ No pets"}</span>
          <span>{hotel.policies?.smoking ? "🚬 Smoking allowed" : "🚭 No smoking"}</span>
          <span>{hotel.policies?.children ? "👶 Children welcome" : "🔞 Adults only"}</span>
        </div>
        <p className="text-sm text-foreground/60">{hotel.policies?.cancellation}</p>
      </div>

      {/* Rooms */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Available Rooms ({rooms.length})</h2>
        {rooms.length === 0 ? (
          <p className="text-foreground/60">No rooms available.</p>
        ) : (
          <div className="space-y-3">
            {rooms.map((room: any) => (
              <div key={room._id} className="rounded-xl border border-black/10 dark:border-white/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{room.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${room.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{room.status}</span>
                  </div>
                  <p className="text-sm text-foreground/60">Room {room.roomNumber} · {room.type} · Floor {room.floor} · {room.size}m²</p>
                  <p className="text-sm text-foreground/60">🛏 {room.bedType} · 👤 {room.capacity?.adults} adults, {room.capacity?.children} children</p>
                </div>
                <div className="text-right shrink-0">
                  {room.discountPrice ? (
                    <div>
                      <p className="text-sm line-through text-foreground/40">${room.price}</p>
                      <p className="text-xl font-bold text-green-600">${room.discountPrice}<span className="text-sm font-normal">/night</span></p>
                    </div>
                  ) : (
                    <p className="text-xl font-bold">${room.price}<span className="text-sm font-normal">/night</span></p>
                  )}
                  {room.status === "available" && (
                    <BookingForm hotelId={id} room={room} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
