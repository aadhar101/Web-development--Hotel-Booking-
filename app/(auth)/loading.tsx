export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      <p className="text-sm text-foreground/60">Loading...</p>
    </div>
  );
}