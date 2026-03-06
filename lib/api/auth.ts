import { AUTH_ENDPOINTS } from "./endpoint";

export async function loginApi(email: string, password: string) {
  const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  return res.json();
}

export async function registerApi(data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) {
  const res = await fetch(AUTH_ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

export async function getMeApi(token: string) {
  const res = await fetch(AUTH_ENDPOINTS.ME, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}