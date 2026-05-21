import type { ApiResponse } from "@nursenest/types";

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.error);
  }
  return json.data;
}

export async function apiFetchServer<T>(
  path: string,
  cookieHeader?: string,
): Promise<T> {
  const base = process.env["INTERNAL_API_URL"] ?? "http://localhost:3001";
  const res = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.error);
  }
  return json.data;
}
