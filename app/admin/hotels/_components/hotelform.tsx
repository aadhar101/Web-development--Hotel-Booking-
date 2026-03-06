
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HotelData, hotelSchema } from "../schema";
import { createHotel, updateHotel } from "../../../../lib/actions/admin/hotel-action";

export default function HotelForm({ hotel }: { hotel?: any }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HotelData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: hotel ?? { name: "", description: "", phone: "", email: "", starRating: 3, isFeatured: false, website: "", address: { street: "", city: "", state: "", country: "", zipCode: "" }, policies: { checkIn: "14:00", checkOut: "11:00", cancellation: "Free cancellation 24h before", pets: false, smoking: false, children: true } },
  });
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string|null>(null);

  const submit = async (values: HotelData) => {
    setError(null);
    setTransition(async () => {
      try {
        const res = hotel ? await updateHotel(hotel._id, values) : await createHotel(values);
        if (!res.success) throw new Error(res.message);
        router.push("/admin/hotels");
      } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
    });
  };

  const cls = "h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40";

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3"><p className="text-sm text-red-600">{error}</p></div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 col-span-2"><label className="text-sm font-medium">Hotel Name</label><input type="text" {...register("name")} className={cls} placeholder="Grand Palace Hotel" />{errors.name?.message&&<p className="text-xs text-red-600">{errors.name.message}</p>}</div>
        <div className="space-y-1"><label className="text-sm font-medium">Phone</label><input type="tel" {...register("phone")} className={cls} placeholder="+1 555-0000" />{errors.phone?.message&&<p className="text-xs text-red-600">{errors.phone.message}</p>}</div>
        <div className="space-y-1"><label className="text-sm font-medium">Email</label><input type="email" {...register("email")} className={cls} />{errors.email?.message&&<p className="text-xs text-red-600">{errors.email.message}</p>}</div>
        <div className="space-y-1"><label className="text-sm font-medium">Star Rating</label><select {...register("starRating")} className={cls}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} Star{n>1?"s":""}</option>)}</select></div>
        <div className="space-y-1"><label className="text-sm font-medium">Website (optional)</label><input type="text" {...register("website")} className={cls} placeholder="https://..." /></div>
      </div>
      <div className="space-y-1"><label className="text-sm font-medium">Description</label><textarea {...register("description")} rows={3} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 resize-none" placeholder="Describe the hotel..." />{errors.description?.message&&<p className="text-xs text-red-600">{errors.description.message}</p>}</div>
      <fieldset className="space-y-3 rounded-xl border border-black/10 p-4">
        <legend className="text-sm font-medium px-1">Address</legend>
        <div className="grid grid-cols-2 gap-3">
          {(["street","city","state","country","zipCode"] as const).map(f=>(
            <div key={f} className={`space-y-1 ${f==="street"?"col-span-2":""}`}><label className="text-sm capitalize">{f}</label><input type="text" {...register(`address.${f}`)} className={cls} />{(errors.address as any)?.[f]?.message&&<p className="text-xs text-red-600">{(errors.address as any)[f].message}</p>}</div>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-3 rounded-xl border border-black/10 p-4">
        <legend className="text-sm font-medium px-1">Policies</legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><label className="text-sm">Check-in time</label><input type="text" {...register("policies.checkIn")} className={cls} placeholder="14:00" /></div>
          <div className="space-y-1"><label className="text-sm">Check-out time</label><input type="text" {...register("policies.checkOut")} className={cls} placeholder="11:00" /></div>
          <div className="space-y-1 col-span-2"><label className="text-sm">Cancellation policy</label><input type="text" {...register("policies.cancellation")} className={cls} /></div>
        </div>
        <div className="flex gap-6 text-sm">
          {(["pets","smoking","children"] as const).map(p=>(
            <label key={p} className="flex items-center gap-2 capitalize cursor-pointer"><input type="checkbox" {...register(`policies.${p}`)} className="rounded" />{p}</label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isFeatured")} className="rounded" />Featured</label>
        </div>
      </fieldset>
      <button type="submit" disabled={isSubmitting||pending} className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">
        {isSubmitting||pending?(hotel?"Saving...":"Creating..."):(hotel?"Save changes":"Create hotel")}
      </button>
    </form>
  );
}
