"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UpdateUserRoleData, updateUserRoleSchema } from "../schema";
import { updateUserRole, toggleUserStatus } from "../../../../lib/actions/admin/user-action";
interface User { _id: string; firstName: string; lastName: string; email: string; role: string; isActive: boolean; }
export default function UpdateUserForm({ user }: { user: User }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateUserRoleData>({ resolver: zodResolver(updateUserRoleSchema), defaultValues: { role: user.role as any } });
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);
  const submit = async (values: UpdateUserRoleData) => {
    setError(null);
    setTransition(async () => {
      try { const res = await updateUserRole(user._id, values.role); if (!res.success) throw new Error(res.message); setSuccess("Role updated"); }
      catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
    });
  };
  const handleToggle = () => { setTransition(async () => { const res = await toggleUserStatus(user._id); if (res.success) router.refresh(); else setError(res.message); }); };
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 space-y-1">
        <p className="font-semibold">{user.firstName} {user.lastName}</p>
        <p className="text-sm text-foreground/60">{user.email}</p>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{user.isActive?"Active":"Inactive"}</span>
      </div>
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3"><p className="text-sm text-red-600">{error}</p></div>}
      {success && <div className="rounded-md bg-green-50 border border-green-200 p-3"><p className="text-sm text-green-600">{success}</p></div>}
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Role</label>
          <select {...register("role")} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none">
            <option value="guest">Guest</option><option value="admin">Admin</option><option value="super_admin">Super Admin</option>
          </select>
          {errors.role?.message && <p className="text-xs text-red-600">{errors.role.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting||pending} className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">{isSubmitting||pending?"Saving...":"Update role"}</button>
      </form>
      <button onClick={handleToggle} disabled={pending} className={`h-10 w-full rounded-md text-sm font-semibold border hover:opacity-90 disabled:opacity-60 ${user.isActive?"border-red-500 text-red-600":"border-green-500 text-green-600"}`}>
        {user.isActive?"Deactivate User":"Activate User"}
      </button>
    </div>
  );
}