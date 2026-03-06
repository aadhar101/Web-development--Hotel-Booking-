"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRoom } from "../../../../../lib/actions/admin/hotel-action";
export default function DeleteRoomBtn({ hotelId, roomId }: { hotelId: string; roomId: string }) {
  const router = useRouter();
  const [pending, setTransition] = useTransition();
  const handle = () => {
    if (!confirm("Delete this room?")) return;
    setTransition(async () => { await deleteRoom(hotelId, roomId); router.refresh(); });
  };
  return <button onClick={handle} disabled={pending} className="text-xs text-red-600 hover:underline disabled:opacity-60">{pending?"Deleting...":"Delete"}</button>;
}