"use client";
export default function UsersError({ error, reset }: { error: Error; reset: () => void }) {
  return <div className="flex flex-col items-center justify-center h-64 gap-4"><p className="text-red-600">Error: {error.message}</p><button onClick={reset} className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold">Retry</button></div>;
}