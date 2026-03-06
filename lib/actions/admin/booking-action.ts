"use server";
import { BOOKING_ENDPOINTS } from "../../../lib/api/endpoint";
import { getAccessToken } from "../../../lib/cookies";
import { revalidatePath } from "next/cache";

interface ActionResult<T = undefined> { success: boolean; message: string; data?: T; }

async function authHeaders() {
  const token = await getAccessToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function parseBody(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; }
  catch { return { message: text || "Unexpected response from server" }; }
}

export async function getAllBookings(page = 1, limit = 10, status?: string): Promise<ActionResult<any>> {
  try {
    const headers = await authHeaders();
    let url = `${BOOKING_ENDPOINTS.ALL}?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    return { success: true, message: "OK", data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function updateBookingStatus(id: string, status: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(BOOKING_ENDPOINTS.UPDATE_STATUS(id), { method: "PATCH", headers, body: JSON.stringify({ status }), cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    revalidatePath("/admin/bookings");
    return { success: true, message: "Status updated", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function getMyBookings(): Promise<ActionResult<any[]>> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${BOOKING_ENDPOINTS.MY_BOOKINGS}?limit=20`, { headers, cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    return { success: true, message: "OK", data: data.data ?? [] };
  } catch { return { success: false, message: "Network error" }; }
}

export async function createBooking(payload: object): Promise<ActionResult<any>> {
  try {
    const headers = await authHeaders();
    const res = await fetch(BOOKING_ENDPOINTS.CREATE, { method: "POST", headers, body: JSON.stringify(payload), cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Booking failed" };
    return { success: true, message: "Booking created", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function cancelBooking(id: string, reason?: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(BOOKING_ENDPOINTS.CANCEL(id), { method: "PATCH", headers, body: JSON.stringify({ cancellationReason: reason }), cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed to cancel" };
    revalidatePath("/user/bookings");
    return { success: true, message: "Booking cancelled" };
  } catch { return { success: false, message: "Network error" }; }
}
