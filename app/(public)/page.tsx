import Link from "next/link";
import { HOTEL_ENDPOINTS } from "../../lib/api/endpoint";

async function getFeaturedHotels() {
  try {
    const res = await fetch(HOTEL_ENDPOINTS.FEATURED, { cache: "no-store" });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedHotels();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 text-center space-y-6 z-10">
        <h1 className="text-5xl font-bold tracking-tight text-white">Find Your Perfect Stay</h1>
        <p className="text-white/80 text-xl">Book hotels with ease. Best prices guaranteed.</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/hotels"
            className="px-8 py-3 rounded-md bg-white text-black font-semibold hover:opacity-90"
          >
            Browse Hotels
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-md border border-white/30 text-white font-semibold hover:bg-white/10"
          >
            Sign up free
          </Link>
        </div>
      </section>

      {/* Featured Hotels */}
      {featured.length > 0 && (
        <section className="relative pb-16 z-10 max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Hotels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((hotel: any) => (
              <Link
                key={hotel._id}
                href={`/hotels/${hotel._id}`}
                className="rounded-xl border border-white/30 overflow-hidden hover:shadow-lg transition-shadow bg-white/5 backdrop-blur-md"
              >
                <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl text-white">
                  🏨
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-white">{hotel.name}</h3>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      {"⭐".repeat(hotel.starRating)}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">
                    {hotel.address?.city}, {hotel.address?.country}
                  </p>
                  <p className="text-sm font-semibold mt-2 text-white">
                    From ${hotel.minPrice ?? "—"}/night
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="relative pb-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center z-10 max-w-5xl mx-auto px-4">
        {[
          { icon: "🔒", title: "Secure Booking", desc: "Your payment is 100% protected" },
          { icon: "💰", title: "Best Prices", desc: "Price match guarantee on all hotels" },
          { icon: "🎧", title: "24/7 Support", desc: "We're here whenever you need us" },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-white/30 p-6 space-y-2 bg-white/5 backdrop-blur-md">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="text-sm text-white/70">{f.desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
