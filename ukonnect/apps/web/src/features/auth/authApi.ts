import { apiFetch } from "../../api/http";
import { loadAuth, saveAuth, clearAuth } from "./authStore";

type AuthResponse = {
  ok: true;
  user: { id: string; email: string };
  accessToken: string;
  refreshToken: string;
};

export async function register(email: string, password: string) {
  const res = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  saveAuth({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  return res;
}

export async function login(email: string, password: string) {
  const res = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  saveAuth({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  return res;
}

export async function refresh() {
  const { refreshToken } = loadAuth();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await apiFetch<{ ok: true; accessToken: string; refreshToken: string }>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
  });

  saveAuth({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  return res;
}

export async function logout() {
  const { refreshToken } = loadAuth();
  if (refreshToken) {
    await apiFetch("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) });
  }
  clearAuth();
}
