export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

let accessToken: string | undefined;

export function setAccessToken(t?: string) { accessToken = t; }

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // for refresh cookie
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (res.status === 401 && path !== "/v1/auth/refresh") {
    // try refresh once
    const r = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: "POST", credentials: "include"
    });
    if (r.ok) {
      const { accessToken: newAT } = await r.json();
      setAccessToken(newAT);
      // retry original
      return api<T>(path, init);
    }
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}