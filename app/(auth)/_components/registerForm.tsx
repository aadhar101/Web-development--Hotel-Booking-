"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "../../../lib/actions/auth-action";
import { User, Mail, Lock, Key, Phone } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const [error, setError] = useState<string | null>(null);

  const submit = async (values: RegisterData) => {
    setError(null);
    try {
      const response = await handleRegister(values);

      if (!response.success) throw new Error(response.message);

      router.push("/login"); // redirect after success
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl bg-white min-h-[600px]">
      {/* Left image */}
      <div className="hidden md:flex md:w-3/5 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/Frame-3.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/40 to-transparent p-12">
          <h1 className="text-white text-4xl italic tracking-wider">YOUR HOLIDAY START HERE</h1>
        </div>
      </div>

      {/* Form */}
      <div className="w-full md:w-2/5 bg-[#3c3f41] p-8 md:p-12 flex flex-col justify-center text-white">
        <h2 className="text-4xl font-bold mb-8 text-center">Sign up</h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          {error && <div className="bg-red-500/20 border border-red-500 p-2 rounded text-xs text-red-200 text-center">{error}</div>}

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <User size={18} className="text-gray-300" />
            <input {...register("firstName")} placeholder="First Name" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>
          {errors.firstName && <p className="text-[10px] text-red-400">{errors.firstName.message}</p>}

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <User size={18} className="text-gray-300" />
            <input {...register("lastName")} placeholder="Last Name" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>
          {errors.lastName && <p className="text-[10px] text-red-400">{errors.lastName.message}</p>}

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <Mail size={18} className="text-gray-300" />
            <input {...register("email")} type="email" placeholder="Your Email" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>
          {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <Phone size={18} className="text-gray-300" />
            <input {...register("phone")} placeholder="Phone (optional)" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <Lock size={18} className="text-gray-300" />
            <input {...register("password")} type="password" placeholder="Password" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>
          {errors.password && <p className="text-[10px] text-red-400">{errors.password.message}</p>}

          <div className="relative border-b border-gray-500 pb-1 flex items-center gap-3">
            <Key size={18} className="text-gray-300" />
            <input {...register("confirmPassword")} type="password" placeholder="Repeat your password" className="bg-transparent w-full outline-none placeholder:text-gray-400 text-sm" />
          </div>
          {errors.confirmPassword && <p className="text-[10px] text-red-400">{errors.confirmPassword.message}</p>}

          <button type="submit" disabled={isSubmitting} className="w-32 bg-[#4279d1] hover:bg-blue-600 text-white py-2 rounded shadow-lg transition-all self-end ml-auto uppercase text-xs font-bold">
            {isSubmitting ? "Creating..." : "Register"}
          </button>

          <div className="text-center text-xs text-gray-400 pt-4">
            Already have an account? <Link href="/login" className="text-white underline">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}