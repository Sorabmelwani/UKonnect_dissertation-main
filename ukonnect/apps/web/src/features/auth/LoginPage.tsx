import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./authApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

export function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {err && <div className="text-sm text-red-600">{err}</div>}

          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <Button
            className="w-full"
            onClick={async () => {
              try {
                setErr(null);
                await login(email, password);
                nav("/onboarding");
              } catch (e: any) {
                setErr(e.message ?? "Login failed");
              }
            }}
          >
            Continue
          </Button>

          <div className="text-sm">
            No account? <Link className="underline" to="/auth/register">Create one</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
