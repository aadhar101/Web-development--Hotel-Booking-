import Link from "next/link";
import { HOTEL_ENDPOINTS } from "../../lib/api/endpoint";

async function getHotels(searchParams: any) {
  const page = searchParams?.page || 1;
  const city = searchParams?.city || "";
  let url = `${HOTEL_ENDPOINTS.LIST}?page=${page}&limit=9`;
  if (city) url += `&city=${city}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return { hotels: data.data ?? [], pagination: data.pagination ?? {} };
  } catch { return { hotels: [], pagination: {} }; }
}

export const metadata = { title: "Hotels" };

export default async function HotelsPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams;
  const { hotels, pagination } = await getHotels(sp);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Hotels</h1>
        <p className="text-sm text-foreground/60">{pagination?.total ?? 0} hotels found</p>
      </div>

      {hotels.length === 0 ? (
        <p className="text-foreground/60 text-center py-12">No hotels found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel: any) => (
            <Link key={hotel._id} href={`/hotels/${hotel._id}`} className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-4xl">🏨</div>
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{hotel.name}</h3>
                  <span className="text-xs shrink-0">{"⭐".repeat(hotel.starRating)}</span>
                </div>
                <p className="text-xs text-foreground/60 mt-1">{hotel.address?.city}, {hotel.address?.country}</p>
                <p className="text-sm font-semibold mt-2 text-blue-600">View Rooms →</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Link key={i} href={`/hotels?page=${i + 1}`}
              className={`h-8 w-8 rounded-md text-sm font-medium flex items-center justify-center border ${(sp?.page ?? 1) == i + 1 ? "bg-foreground text-background border-foreground" : "border-black/10 hover:bg-black/5"}`}>
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}