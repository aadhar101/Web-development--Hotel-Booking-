"use server";
import { HOTEL_ENDPOINTS } from "../../../lib/api/endpoint";
import { getAccessToken } from "../../../lib/cookies";
import { revalidatePath } from "next/cache";

interface ActionResult<T = any> { success: boolean; message: string; data?: T; }

async function authHeaders() {
  const token = await getAccessToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function parseBody(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; }
  catch { return { message: text || "Unexpected response from server" }; }
}

export async function getAllHotels(page = 1, limit = 10): Promise<ActionResult> {
  try {
    const res = await fetch(`${HOTEL_ENDPOINTS.LIST}?page=${page}&limit=${limit}`, { cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    return { success: true, message: "OK", data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function getHotelById(id: string): Promise<ActionResult> {
  try {
    const res = await fetch(HOTEL_ENDPOINTS.DETAIL(id), { cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Hotel not found" };
    return { success: true, message: "OK", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function createHotel(payload: object): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(HOTEL_ENDPOINTS.CREATE, { method: "POST", headers, body: JSON.stringify(payload), cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed to create hotel" };
    revalidatePath("/admin/hotels");
    return { success: true, message: "Hotel created", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function updateHotel(id: string, payload: object): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(HOTEL_ENDPOINTS.UPDATE(id), { method: "PATCH", headers, body: JSON.stringify(payload), cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed to update hotel" };
    revalidatePath("/admin/hotels");
    return { success: true, message: "Hotel updated", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function deleteHotel(id: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(HOTEL_ENDPOINTS.DELETE(id), { method: "DELETE", headers, cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed to delete hotel" };
    revalidatePath("/admin/hotels");
    return { success: true, message: "Hotel deleted" };
  } catch { return { success: false, message: "Network error" }; }
}

export async function createRoom(hotelId: string, payload: object): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(HOTEL_ENDPOINTS.CREATE_ROOM(hotelId), { method: "POST", headers, body: JSON.stringify(payload), cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed to create room" };
    revalidatePath(`/admin/hotels/${hotelId}/rooms`);
    return { success: true, message: "Room created", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function deleteRoom(hotelId: string, roomId: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(HOTEL_ENDPOINTS.DELETE_ROOM(hotelId, roomId), { method: "DELETE", headers, cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    revalidatePath(`/admin/hotels/${hotelId}/rooms`);
    return { success: true, message: "Room deleted" };
  } catch { return { success: false, message: "Network error" }; }
}
