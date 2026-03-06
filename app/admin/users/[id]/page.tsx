import { getUserById } from "../../../../lib/actions/admin/user-action";
import { notFound } from "next/navigation";
import Link from "next/link";
export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getUserById(id);
  if (!result.success || !result.data) return notFound();
  const u = result.data;
  return (
    <div className="max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Link href={`/admin/users/${id}/edit`} className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90">Edit</Link>
      </div>
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 space-y-3">
        {[["Name",`${u.firstName} ${u.lastName}`],["Email",u.email],["Phone",u.phone||"—"],["Role",u.role],["Status",u.isActive?"Active":"Inactive"],["Email Verified",u.isEmailVerified?"Yes":"No"]].map(([l,v])=>(
          <div key={String(l)} className="flex justify-between text-sm border-b border-black/5 pb-2 last:border-0">
            <span className="text-foreground/60">{l}</span><span className="font-medium capitalize">{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}