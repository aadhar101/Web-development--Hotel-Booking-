
import RoomForm from "../../../_components/roomform";

export default async function CreateRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="max-w-2xl space-y-4"><h1 className="text-2xl font-bold">Add Room</h1><RoomForm hotelId={id} /></div>;
}
