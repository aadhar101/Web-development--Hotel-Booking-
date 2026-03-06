"use server";

import { USER_ENDPOINTS } from "../../../lib/api/endpoint";
import { getAccessToken } from "../../../lib/cookies";
import { revalidatePath } from "next/cache";

interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

async function authHeaders() {
  const token = await getAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseBody(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Unexpected response from server" };
  }
}

export async function getMyProfile(): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(USER_ENDPOINTS.PROFILE, {
      headers,
      cache: "no-store",
    });
    const data = await parseBody(res);

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch profile" };
    }

    return { success: true, message: "OK", data: data.data ?? null };
  } catch {
    return { success: false, message: "Network error" };
  }
}

export async function updateMyProfile(payload: object): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(USER_ENDPOINTS.PROFILE, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await parseBody(res);

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update profile" };
    }

    revalidatePath("/user/profile");
    return { success: true, message: data.message || "Profile updated", data: data.data };
  } catch {
    return { success: false, message: "Network error" };
  }
}

