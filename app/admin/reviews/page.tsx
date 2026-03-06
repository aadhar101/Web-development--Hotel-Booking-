import { getAccessToken } from "../../../lib/cookies";
import { REVIEW_ENDPOINTS } from "../../../lib/api/endpoint";
import ReviewActions from "./reviewaction";
export const metadata = { title: "Manage Reviews" };

async function getReviews(token: string) {
  try {
    const res = await fetch(`${REVIEW_ENDPOINTS.ALL}?limit=50`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const data = await res.json();
    return data.data ?? [];
  } catch { return []; }
}

export default async function AdminReviewsPage() {
  const token = await getAccessToken();
  const reviews: any[] = token ? await getReviews(token) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reviews</h1>
      {reviews.length === 0 ? <p className="text-foreground/60">No reviews found.</p> : (
        <div className="space-y-3">
          {reviews.map((r)=>(
            <div key={r._id} className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-2">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{r.user?.firstName} {r.user?.lastName}</span>
                    <span className="text-xs text-foreground/50">on {r.hotel?.name}</span>
                    <span>{["⭐"].join("").repeat(r.rating)}</span>
                  </div>
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="text-sm text-foreground/70">{r.comment}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.isApproved?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{r.isApproved?"Approved":"Pending"}</span>
                  <ReviewActions reviewId={r._id} isApproved={r.isApproved} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}