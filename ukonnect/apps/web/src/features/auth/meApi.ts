import { apiFetch } from "../../api/http";
import { loadAuth } from "./authStore";
import { refresh } from "./authApi";

async function withToken<T>(fn: (token: string) => Promise<T>) {
  let { accessToken } = loadAuth();
  if (!accessToken) throw new Error("Not authenticated");

  try {
    return await fn(accessToken);
  } catch (e: any) {
    // naive auto-refresh on failure
    await refresh();
    accessToken = loadAuth().accessToken!;
    return await fn(accessToken);
  }
}

export function getMe() {
  return withToken((t) => apiFetch<{ ok: true; me: any }>("/me", {}, t));
}

export function updateProfile(patch: any) {
  return withToken((t) =>
    apiFetch<{ ok: true; profile: any }>("/me/profile", {
      method: "PUT",
      body: JSON.stringify(patch)
    }, t)
  );
}
