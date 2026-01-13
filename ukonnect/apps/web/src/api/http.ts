const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function apiFetch<T>(path: string, options: RequestInit = {}, accessToken?: string) {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message ?? "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

export async function apiFetchForm<T>(path: string, form: FormData, accessToken?: string) {
  const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
  const headers = new Headers();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(`${API_URL}${path}`, { method: "POST", body: form, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message ?? "Upload failed";
    throw new Error(msg);
  }
  return data as T;
}
