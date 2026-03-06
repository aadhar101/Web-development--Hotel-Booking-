const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1";

interface RequestConfig { method?: string; body?: unknown; token?: string; cache?: RequestCache; }

async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const { method = "GET", body, token, cache = "no-store" } = config;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined, cache });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  get:    <T>(url: string, token?: string) => request<T>(url, { token }),
  post:   <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: "POST", body, token }),
  put:    <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: "PUT", body, token }),
  patch:  <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: "PATCH", body, token }),
  delete: <T>(url: string, token?: string) => request<T>(url, { method: "DELETE", token }),
};