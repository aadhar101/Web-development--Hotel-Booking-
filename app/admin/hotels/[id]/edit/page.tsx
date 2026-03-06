import { getHotelById } from "../../../../../lib/actions/admin/hotel-action";
import HotelForm from "../../_components/hotelform";
import { notFound } from "next/navigation";
export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getHotelById(id);
  if (!result.success || !result.data) return notFound();
  return <div className="max-w-2xl space-y-4"><h1 className="text-2xl font-bold">Edit Hotel</h1><HotelForm hotel={result.data} /></div>;
}