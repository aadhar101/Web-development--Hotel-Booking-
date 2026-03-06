
import { z } from "zod";
export const hotelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  website: z.string().optional(),
  starRating: z.coerce.number().min(1).max(5),
  isFeatured: z.boolean(),
  address: z.object({ street: z.string().min(1), city: z.string().min(1), state: z.string().min(1), country: z.string().min(1), zipCode: z.string().min(1) }),
  policies: z.object({ checkIn: z.string(), checkOut: z.string(), cancellation: z.string(), pets: z.boolean(), smoking: z.boolean(), children: z.boolean() }),
});
export type HotelData = z.infer<typeof hotelSchema>;
export const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.enum(["standard", "deluxe", "suite", "presidential", "penthouse"]),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1),
  price: z.coerce.number().min(1),
  discountPrice: z.coerce.number().optional(),
  capacity: z.object({ adults: z.coerce.number().min(1), children: z.coerce.number().min(0) }),
  size: z.coerce.number().min(1),
  floor: z.coerce.number().min(0),
  bedType: z.string().min(1),
  view: z.string().optional(),
  status: z.enum(["available", "occupied", "maintenance", "reserved"]),
});
export type RoomData = z.infer<typeof roomSchema>;
