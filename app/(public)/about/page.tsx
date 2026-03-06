export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">About HotelBook</h1>
      <p className="text-foreground/70 leading-relaxed">We connect travelers with the best hotels around the world. Our platform makes booking simple, transparent, and affordable.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {[["500+", "Hotels"], ["50,000+", "Bookings"], ["98%", "Satisfaction"]].map(([num, label]) => (
          <div key={label} className="rounded-xl border border-black/10 dark:border-white/10 p-5 text-center">
            <p className="text-3xl font-bold">{num}</p>
            <p className="text-sm text-foreground/60 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}