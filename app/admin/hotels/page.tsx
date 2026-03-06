import { getAllHotels } from "../../../lib/actions/admin/hotel-action";
import Link from "next/link";
import HotelTable from "./_components/hoteltable";
export const metadata = { title: "Manage Hotels" };
export default async function AdminHotelsPage() {
  const result = await getAllHotels(1, 20);
  const hotels = result.data?.data ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Link href="/admin/hotels/create" className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90">+ Add Hotel</Link>
      </div>
      <HotelTable hotels={hotels} />
    </div>
  );
}