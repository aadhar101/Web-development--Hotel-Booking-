"use client";
interface Props { isOpen: boolean; title?: string; description?: string; onConfirm: () => void; onCancel: () => void; loading?: boolean; }
export default function DeleteModal({ isOpen, title = "Confirm Delete", description = "This action cannot be undone.", onConfirm, onCancel, loading = false }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-background border border-black/10 dark:border-white/10 p-6 shadow-lg space-y-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-foreground/60">{description}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-md border border-black/10 text-sm font-medium hover:bg-black/5 disabled:opacity-60">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}