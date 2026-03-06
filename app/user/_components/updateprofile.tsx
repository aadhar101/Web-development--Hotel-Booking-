"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { UpdateProfileData, updateProfileSchema } from "../schema";
import { updateMyProfile } from "../../../lib/actions/user/profile-action";

interface User { firstName: string; lastName: string; email: string; avatar?: string; phone?: string; address?: any; }

export default function UpdateProfile({ user }: { user: User | null }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", avatar: user?.avatar ?? "", phone: user?.phone ?? "", address: user?.address ?? {} },
  });
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (values: UpdateProfileData) => {
    setError(null); setSuccess(null);
    setTransition(async () => {
      try {
        const payload = {
          ...values,
          avatar: values.avatar?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          address: values.address && Object.values(values.address).some(Boolean) ? values.address : undefined,
        };

        const result = await updateMyProfile(payload);
        if (!result.success) throw new Error(result.message || "Update failed");
        setSuccess(result.message || "Profile updated successfully");
      } catch (err: unknown) { setError(err instanceof Error ? err.message : "Update failed"); }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3"><p className="text-sm text-red-600">{error}</p></div>}
      {success && <div className="rounded-md bg-green-50 border border-green-200 p-3"><p className="text-sm text-green-600">{success}</p></div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">First name</label>
          <input type="text" {...register("firstName")} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" />
          {errors.firstName?.message && <p className="text-xs text-red-600">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Last name</label>
          <input type="text" {...register("lastName")} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" />
          {errors.lastName?.message && <p className="text-xs text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Profile Photo URL</label>
        <input type="url" {...register("avatar")} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" placeholder="https://example.com/avatar.jpg" />
        {errors.avatar?.message && <p className="text-xs text-red-600">{errors.avatar.message}</p>}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Phone</label>
        <input type="tel" {...register("phone")} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" placeholder="+1 (555) 000-0000" />
      </div>
      <fieldset className="space-y-3 rounded-xl border border-black/10 dark:border-white/10 p-4">
        <legend className="text-sm font-medium px-1">Address</legend>
        {(["street","city","state","country","zipCode"] as const).map((field) => (
          <div key={field} className="space-y-1">
            <label className="text-sm capitalize">{field}</label>
            <input type="text" {...register(`address.${field}`)} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" />
          </div>
        ))}
      </fieldset>
      <button type="submit" disabled={isSubmitting || pending} className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">
        {isSubmitting || pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
