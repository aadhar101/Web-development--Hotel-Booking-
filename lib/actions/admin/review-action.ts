"use server";

import { REVIEW_ENDPOINTS } from "../../../lib/api/endpoint";
import { getAccessToken } from "../../../lib/cookies";
import { revalidatePath } from "next/cache";

interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

async function authHeaders() {
  const token = await getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

async function parseBody(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Unexpected response from server" };
  }
}

export async function approveReview(id: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(REVIEW_ENDPOINTS.APPROVE(id), { method: "PATCH", headers, cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed to approve review" };
    revalidatePath("/admin/reviews");
    return { success: true, message: "Review approved" };
  } catch {
    return { success: false, message: "Network error" };
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(REVIEW_ENDPOINTS.DELETE(id), { method: "DELETE", headers, cache: "no-store" });
    const data = await parseBody(res);
    if (!res.ok) return { success: false, message: data.message || "Failed to delete review" };
    revalidatePath("/admin/reviews");
    return { success: true, message: "Review deleted" };
  } catch {
    return { success: false, message: "Network error" };
  }
}

