import { apiFetch, apiFetchForm } from "../../api/http";
import { loadAuth } from "../auth/authStore";
import { refresh } from "../auth/authApi";

async function tok() {
  let { accessToken } = loadAuth();
  if (!accessToken) throw new Error("Not authenticated");
  return accessToken;
}

async function call<T>(fn: (t: string) => Promise<T>) {
  try {
    return await fn(await tok());
  } catch {
    await refresh();
    return await fn(loadAuth().accessToken!);
  }
}

export function generateTasks() {
  return call((t) => apiFetch<{ ok: true; created: any[] }>("/tasks/generate", { method: "POST" }, t));
}

export function listTasks(params: { status?: string; category?: string; priority?: string } = {}) {
  const qs = new URLSearchParams(params as any).toString();
  return call((t) => apiFetch<{ ok: true; tasks: any[] }>(`/tasks?${qs}`, {}, t));
}

export function patchTask(id: string, patch: any) {
  return call((t) =>
    apiFetch<{ ok: true; task: any }>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) }, t)
  );
}

export function getDashboard() {
  return call((t) => apiFetch<{ ok: true; dashboard: any }>("/dashboard", {}, t));
}

export function uploadDocument(file: File, category?: string, notes?: string) {
  const form = new FormData();
  form.append("file", file);
  if (category) form.append("category", category);
  if (notes) form.append("notes", notes);

  return call((t) => apiFetchForm<{ ok: true; document: any }>("/documents/upload", form, t));
}

export function listDocuments() {
  return call((t) => apiFetch<{ ok: true; documents: any[] }>("/documents", {}, t));
}
