
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RoomData, roomSchema } from "../schema";
import { createRoom } from "../../../../lib/actions/admin/hotel-action";

export default function RoomForm({ hotelId }: { hotelId: string }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RoomData>({ 
    resolver: zodResolver(roomSchema) as any,
    defaultValues: { roomNumber: "", type: "standard", name: "", description: "", price: 0, capacity: { adults: 2, children: 0 }, size: 0, floor: 0, bedType: "", view: "", status: "available" } 
  });
  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string|null>(null);

  const submit = async (values: RoomData) => {
    setError(null);
    setTransition(async () => {
      try {
        const payload = {
          ...values,
          price: Number(values.price),
          discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
          capacity: {
            adults: Number(values.capacity.adults),
            children: Number(values.capacity.children),
          },
          size: Number(values.size),
          floor: Number(values.floor),
        };

        const res = await createRoom(hotelId, payload);
        if (!res.success) throw new Error(res.message);
        router.push(`/admin/hotels/${hotelId}/rooms`);
      } catch (err: unknown) { 
        setError(err instanceof Error ? err.message : "Failed"); 
      }
    });
  };

  const cls = "h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40";

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3"><p className="text-sm text-red-600">{error}</p></div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><label className="text-sm font-medium">Room Number</label><input {...register("roomNumber")} className={cls} placeholder="101" />{errors.roomNumber?.message&&<p className="text-xs text-red-600">{errors.roomNumber.message}</p>}</div>
        <div className="space-y-1"><label className="text-sm font-medium">Type</label><select {...register("type")} className={cls}>{["standard","deluxe","suite","presidential","penthouse"].map(t=><option key={t} value={t} className="capitalize">{t}</option>)}</select></div>
        <div className="space-y-1 col-span-2"><label className="text-sm font-medium">Room Name</label><input {...register("name")} className={cls} placeholder="Deluxe King Room" />{errors.name?.message&&<p className="text-xs text-red-600">{errors.name.message}</p>}</div>
        <div className="space-y-1"><label className="text-sm font-medium">Price/night ($)</label><input type="number" {...register("price")} className={cls} placeholder="150" />{errors.price?.message&&<p className="text-xs text-red-600">{errors.price.message}</p>}</div>
        <div className="space-y-1"><label className="text-sm font-medium">Discount Price (optional)</label><input type="number" {...register("discountPrice")} className={cls} placeholder="120" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Adults</label><input type="number" {...register("capacity.adults")} className={cls} /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Children</label><input type="number" {...register("capacity.children")} className={cls} /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Size (m²)</label><input type="number" {...register("size")} className={cls} /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Floor</label><input type="number" {...register("floor")} className={cls} /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Bed Type</label><input {...register("bedType")} className={cls} placeholder="King / Twin / Double" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">View (optional)</label><input {...register("view")} className={cls} placeholder="Ocean / City / Garden" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Status</label><select {...register("status")} className={cls}>{["available","occupied","maintenance","reserved"].map(s=><option key={s} value={s} className="capitalize">{s}</option>)}</select></div>
      </div>
      <div className="space-y-1"><label className="text-sm font-medium">Description</label><textarea {...register("description")} rows={3} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none resize-none" />{errors.description?.message&&<p className="text-xs text-red-600">{errors.description.message}</p>}</div>
      <button type="submit" disabled={isSubmitting||pending} className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">{isSubmitting||pending?"Creating...":"Create room"}</button>
    </form>
  );
}
