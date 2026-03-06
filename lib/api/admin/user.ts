import { USER_ENDPOINTS } from "../endpoint";

export async function fetchUsers(token: string, page = 1, limit = 10) {
  const res = await fetch(`${USER_ENDPOINTS.ALL}?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

export async function fetchUserById(token: string, id: string) {
  const res = await fetch(USER_ENDPOINTS.DETAIL(id), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}