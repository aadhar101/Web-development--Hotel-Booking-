"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateUserData, createUserSchema } from "../schema";
import { handleRegister } from "../../../../lib/actions/auth-action";

export default function CreateUserForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateUserData>({ resolver: zodResolver(createUserSchema), mode: "onSubmit" });
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: CreateUserData) => {
    setError(null);
    setTransition(async () => {
      try {
        const res = await handleRegister({ ...values, confirmPassword: values.password });
        if (!res.success) throw new Error(res.message);
        router.push("/admin/users");
      } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to create user"); }
    });
  };

  const field = (id: string, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1" key={id}>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} {...register(id as any)} placeholder={placeholder} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" />
      {(errors as any)[id]?.message && <p className="text-xs text-red-600">{(errors as any)[id].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3"><p className="text-sm text-red-600">{error}</p></div>}
      <div className="grid grid-cols-2 gap-4">{field("firstName","First name","text","Jane")}{field("lastName","Last name","text","Doe")}</div>
      {field("email","Email","email","jane@example.com")}
      {field("phone","Phone (optional)","tel","+1 (555) 000-0000")}
      {field("password","Password","password","••••••")}
      <div className="space-y-1">
        <label className="text-sm font-medium">Role</label>
        <select {...register("role")} className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none">
          <option value="guest">Guest</option><option value="admin">Admin</option><option value="super_admin">Super Admin</option>
        </select>
      </div>
      <button type="submit" disabled={isSubmitting||pending} className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">{isSubmitting||pending?"Creating...":"Create user"}</button>
    </form>
  );
}