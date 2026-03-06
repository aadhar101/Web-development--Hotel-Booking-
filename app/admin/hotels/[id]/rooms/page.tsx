import { getHotelById } from "../../../../../lib/actions/admin/hotel-action";
import { HOTEL_ENDPOINTS } from "../../../../../lib/api/endpoint";
import { getAccessToken } from "../../../../../lib/cookies";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteRoomBtn from "./deleteroombtn";

async function getRooms(hotelId: string, token: string) {
  try {
    const res = await fetch(HOTEL_ENDPOINTS.ROOMS(hotelId), { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const data = await res.json();
    return data.data ?? [];
  } catch { return []; }
}

export default async function HotelRoomsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getAccessToken();
  const [hotelResult, rooms] = await Promise.all([getHotelById(id), token ? getRooms(id, token) : []]);
  if (!hotelResult.success || !hotelResult.data) return notFound();
  const hotel = hotelResult.data as any;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rooms — {hotel.name}</h1>
          <p className="text-sm text-foreground/60">{rooms.length} room{rooms.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href={`/admin/hotels/${id}/rooms/create`} className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90">+ Add Room</Link>
      </div>
      {rooms.length === 0 ? <p className="text-foreground/60">No rooms yet.</p> : (
        <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-black/10">{["Room #","Name","Type","Price","Status","Actions"].map(h=><th key={h} className="px-4 py-3 text-left font-medium text-foreground/60">{h}</th>)}</tr></thead>
            <tbody>{rooms.map((room: any) => (
              <tr key={room._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-mono">{room.roomNumber}</td>
                <td className="px-4 py-3">{room.name}</td>
                <td className="px-4 py-3 capitalize">{room.type}</td>
                <td className="px-4 py-3">${room.discountPrice ?? room.price}{room.discountPrice && <span className="text-xs text-foreground/40 line-through ml-1">${room.price}</span>}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${room.status==="available"?"bg-green-100 text-green-700":room.status==="maintenance"?"bg-yellow-100 text-yellow-700":"bg-gray-100 text-gray-600"}`}>{room.status}</span></td>
                <td className="px-4 py-3"><DeleteRoomBtn hotelId={id} roomId={room._id} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
