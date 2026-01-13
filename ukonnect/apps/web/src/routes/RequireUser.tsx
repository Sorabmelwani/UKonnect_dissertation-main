import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { loadAuth } from "../features/auth/authStore";

export function RequireUser({ children }: { children: ReactNode }) {
  const { accessToken } = loadAuth();
  if (!accessToken) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
}
