
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveReview, deleteReview } from "../../../lib/actions/admin/review-action";

export default function ReviewActions({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) {
  const router = useRouter();
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleApprove = () => {
    setError(null);
    setTransition(async () => {
      const res = await approveReview(reviewId);
      if (!res.success) {
        setError(res.message);
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this review?")) return;
    setError(null);
    setTransition(async () => {
      const res = await deleteReview(reviewId);
      if (!res.success) {
        setError(res.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {!isApproved && <button onClick={handleApprove} disabled={pending} className="text-xs text-green-600 font-medium hover:underline disabled:opacity-60">Approve</button>}
        <button onClick={handleDelete} disabled={pending} className="text-xs text-red-600 font-medium hover:underline disabled:opacity-60">Delete</button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
