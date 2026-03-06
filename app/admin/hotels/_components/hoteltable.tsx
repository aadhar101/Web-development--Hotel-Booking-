
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteHotel } from "../../../../lib/actions/admin/hotel-action";
interface Hotel { _id: string; name: string; address: { city: string; country: string }; starRating: number; isActive: boolean; totalRooms: number; }
export default function HotelTable({ hotels }: { hotels: Hotel[] }) {
  const [list, setList] = useState(hotels);
  const [pending, setTransition] = useTransition();
  const handleDelete = (id: string) => {
    if (!confirm("Delete this hotel? All rooms and bookings will be affected.")) return;
    setTransition(async () => { const res = await deleteHotel(id); if (res.success) setList(p => p.filter(h => h._id !== id)); });
  };
  if (!list.length) return <p className="text-sm text-foreground/60">No hotels found.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-black/10">{["Name","Location","Stars","Rooms","Actions"].map(h=><th key={h} className="px-4 py-3 text-left font-medium text-foreground/60">{h}</th>)}</tr></thead>
        <tbody>{list.map(hotel=>(
          <tr key={hotel._id} className="border-b border-black/5 last:border-0">
            <td className="px-4 py-3 font-medium">{hotel.name}</td>
            <td className="px-4 py-3 text-foreground/60">{hotel.address?.city}, {hotel.address?.country}</td>
            <td className="px-4 py-3">{"⭐".repeat(hotel.starRating)}</td>
            <td className="px-4 py-3">{hotel.totalRooms ?? "—"}</td>
            <td className="px-4 py-3"><div className="flex gap-3">
<Link href={`/admin/hotels/${hotel._id}/rooms`} className="text-xs hover:underline text-blue-600">Rooms</Link>
              <Link href={`/admin/hotels/${hotel._id}/edit`} className="text-xs hover:underline">Edit</Link>
              <button onClick={()=>handleDelete(hotel._id)} disabled={pending} className="text-xs hover:underline text-red-600">Delete</button>
            </div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}