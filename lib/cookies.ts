
"use server";
import { cookies } from "next/headers";

const ACCESS_TOKEN  = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const USER_KEY      = "user";

export async function setAuthCookies(accessToken: string, refreshToken?: string, user?: object) {
  const store = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  store.set(ACCESS_TOKEN, accessToken, { httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
  if (refreshToken) store.set(REFRESH_TOKEN, refreshToken, { httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
  if (user) store.set(USER_KEY, JSON.stringify(user), { httpOnly: false, secure: isProd, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN)?.value;
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN);
  store.delete(REFRESH_TOKEN);
  store.delete(USER_KEY);
}

export async function getUserFromCookie() {
  const store = await cookies();
  const raw = store.get(USER_KEY)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
