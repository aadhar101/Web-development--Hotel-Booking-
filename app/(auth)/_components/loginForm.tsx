"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { handleLogin } from "../../../lib/actions/auth-action";
import { useAuth } from "../../../context/authcontext";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: LoginData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await handleLogin(values);
        if (!response.success) throw new Error(response.message);

        if (response.data?.user) {
          setUser(response.data.user);
        }

        const role = response.data?.role;
        const next = searchParams.get("next");
        const safeNext = next && next.startsWith("/") ? next : null;

        if (role === "admin" || role === "super_admin") router.replace("/admin");
        else router.replace(safeNext ?? "/user/dashboard");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-2xl bg-white min-h-[600px] rounded-3xl overflow-hidden">
      <div className="hidden md:flex md:w-3/5 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/Frame-3.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/40 to-transparent p-12">
          <h1 className="text-white text-4xl italic tracking-wider">YOUR HOLIDAY START HERE</h1>
        </div>
      </div>

      <div className="w-full md:w-2/5 bg-[#3c3f41] p-8 md:p-12 flex flex-col justify-center text-white">
        <h2 className="text-4xl font-bold mb-8 text-center">Login</h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          {error && <div className="bg-red-500/20 border border-red-500 p-2 rounded text-xs text-red-200 text-center">{error}</div>}

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <Mail size={18} className="text-gray-300" />
            <input {...register("email")} type="email" placeholder="Your Email" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>
          {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <Lock size={18} className="text-gray-300" />
            <input {...register("password")} type="password" placeholder="Password" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>
          {errors.password && <p className="text-[10px] text-red-400">{errors.password.message}</p>}

          <button type="submit" disabled={isSubmitting || pending} className="w-32 bg-[#4279d1] hover:bg-blue-600 text-white py-2 rounded shadow-lg transition-all self-end ml-auto uppercase text-xs font-bold">
            {isSubmitting || pending ? "..." : "Login"}
          </button>

          <div className="text-center text-xs text-gray-400 pt-4">
            Forgot your password? <Link href="/forgot-password" className="text-white underline">Reset</Link>
          </div>

          <div className="text-center text-xs text-gray-400 pt-2">
            Don't have an account? <Link href="/register" className="text-white underline">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
