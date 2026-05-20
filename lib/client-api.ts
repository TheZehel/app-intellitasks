"use client";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export const isExternalApiEnabled = Boolean(apiBaseUrl);

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
  });
}
