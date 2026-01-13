import { Outlet, Link, useLocation } from "react-router-dom";
import { logout } from "../features/auth/authApi";
import { Button } from "../components/ui/button";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/documents", label: "Documents" },
  { to: "/local-services", label: "Local Services" },
  { to: "/community", label: "Community" },
  { to: "/ai", label: "AI Assistant" }
];

export function AppShell() {
  const loc = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4">
        <div className="font-semibold text-lg mb-4">UKonnect</div>

        <nav className="space-y-1">
          {nav.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className={`block rounded px-3 py-2 text-sm ${
                loc.pathname === n.to ? "bg-muted font-medium" : "hover:bg-muted"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await logout();
              window.location.href = "/auth/login";
            }}
          >
            Log out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
