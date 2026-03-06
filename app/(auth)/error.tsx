"use client";

import { useEffect } from "react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center space-y-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-foreground/60">{error.message}</p>
      <button
        onClick={reset}
        className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}