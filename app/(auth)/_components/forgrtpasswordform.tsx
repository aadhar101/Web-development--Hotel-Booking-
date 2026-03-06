

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ForgotPasswordData, forgotPasswordSchema } from "../schema";
import { handleForgotPassword } from "../../../lib/actions/auth-action";

export default function ForgetPasswordForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordData>({ resolver: zodResolver(forgotPasswordSchema), mode: "onSubmit" });
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (values: ForgotPasswordData) => {
    setError(null); setSuccess(null);
    setTransition(async () => {
      try {
        const response = await handleForgotPassword(values);
        if (!response.success) throw new Error(response.message);
        setSuccess(response.message);
      } catch (err: unknown) { setError(err instanceof Error ? err.message : "Request failed"); }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3"><p className="text-sm text-red-600">{error}</p></div>}
      {success && <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3"><p className="text-sm text-green-600">{success}</p></div>}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">Email address</label>
        <input id="email" type="email" autoComplete="email" className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40 transition-colors" {...register("email")} placeholder="you@example.com" />
        {errors.email?.message && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting || pending} className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
        {isSubmitting || pending ? "Sending..." : "Send reset link"}
      </button>
      <div className="mt-1 text-center text-sm"><Link href="/login" className="font-semibold hover:underline">Back to login</Link></div>
    </form>
  );
}
