
"use server";
import { USER_ENDPOINTS, ADMIN_ENDPOINTS } from "../../../lib/api/endpoint";
import { getAccessToken } from "../../../lib/cookies";
import { revalidatePath } from "next/cache";

interface ActionResult<T = any> { success: boolean; message: string; data?: T; }

async function authHeaders() {
  const token = await getAccessToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function getAllUsers(page = 1, limit = 10): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${USER_ENDPOINTS.ALL}?page=${page}&limit=${limit}`, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to fetch users" };
    return { success: true, message: "OK", data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function getUserById(id: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(USER_ENDPOINTS.DETAIL(id), { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "User not found" };
    return { success: true, message: "OK", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function toggleUserStatus(id: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(USER_ENDPOINTS.TOGGLE_STATUS(id), { method: "PATCH", headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    revalidatePath("/admin/users");
    return { success: true, message: "Status updated", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function updateUserRole(id: string, role: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(USER_ENDPOINTS.UPDATE_ROLE(id), { method: "PATCH", headers, body: JSON.stringify({ role }), cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    revalidatePath("/admin/users");
    return { success: true, message: "Role updated", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(USER_ENDPOINTS.DELETE(id), { method: "DELETE", headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    revalidatePath("/admin/users");
    return { success: true, message: "User deleted" };
  } catch { return { success: false, message: "Network error" }; }
}

export async function getAdminDashboard(): Promise<ActionResult> {
  try {
    const headers = await authHeaders();
    const res = await fetch(ADMIN_ENDPOINTS.DASHBOARD, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed" };
    return { success: true, message: "OK", data: data.data };
  } catch { return { success: false, message: "Network error" }; }
}
