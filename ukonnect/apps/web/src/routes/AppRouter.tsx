import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { OnboardingPage } from "../features/auth/OnboardingPage";
import { DashboardPage } from "../features/tasks/DashboardPage";
import { TasksPage } from "../features/tasks/TasksPage";
import { DocumentsPage } from "../features/docs/DocumentsPage";
import { ServicesPage } from "../features/services/ServicesPage";
import { CommunityPage } from "../features/community/CommunityPage";
import { AiChatPage } from "../features/ai/AiChatPage";
import { AppShell } from "../components/AppShell";
import { RequireUser } from "./RequireUser";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <RequireUser>
              <AppShell />
            </RequireUser>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="local-services" element={<ServicesPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="ai" element={<AiChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
