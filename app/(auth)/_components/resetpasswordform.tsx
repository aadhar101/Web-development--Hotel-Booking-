"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordData, resetPasswordSchema } from "../schema";
import { handleResetPassword } from "../../../lib/actions/auth-action";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordData>({ resolver: zodResolver(resetPasswordSchema), mode: "onSubmit", defaultValues: { token } });
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (values: ResetPasswordData) => {
    setError(null); setSuccess(null);
    setTransition(async () => {
      try {
        const response = await handleResetPassword({ ...values, token });
        if (!response.success) throw new Error(response.message);
        setSuccess("Password reset! Redirecting to login...");
        setTimeout(() => router.replace("/login"), 2000);
      } catch (err: unknown) { setError(err instanceof Error ? err.message : "Reset failed"); }
    });
  };

  if (!token) return (
    <div className="rounded-md bg-red-50 border border-red-200 p-3">
      <p className="text-sm text-red-600">Invalid or missing reset token. Please request a new password reset link.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3"><p className="text-sm text-red-600">{error}</p></div>}
      {success && <div className="rounded-md bg-green-50 border border-green-200 p-3"><p className="text-sm text-green-600">{success}</p></div>}
      <input type="hidden" {...register("token")} value={token} />
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">New password</label>
        <input id="password" type="password" autoComplete="new-password" className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" {...register("password")} placeholder="••••••" />
        {errors.password?.message && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm new password</label>
        <input id="confirmPassword" type="password" autoComplete="new-password" className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" {...register("confirmPassword")} placeholder="••••••" />
        {errors.confirmPassword?.message && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting || pending} className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">
        {isSubmitting || pending ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}