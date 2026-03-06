import HotelForm from "../_components/hotelform";
export const metadata = { title: "Create Hotel" };
export default function CreateHotelPage() {
  return <div className="max-w-2xl space-y-4"><h1 className="text-2xl font-bold">Create Hotel</h1><HotelForm /></div>;
}