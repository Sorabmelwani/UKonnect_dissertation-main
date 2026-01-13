import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { updateProfile } from "./meApi";
import { generateTasks } from "../tasks/tasksApi";

export function OnboardingPage() {
  const nav = useNavigate();
  const [visaType, setVisaType] = useState("Student");
  const [purpose, setPurpose] = useState("Study");
  const [city, setCity] = useState("London");
  const [nationality, setNationality] = useState("Pakistan");
  const [err, setErr] = useState<string | null>(null);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Onboarding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {err && <div className="text-sm text-red-600">{err}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Visa type</Label>
            <Input value={visaType} onChange={e => setVisaType(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Purpose</Label>
            <Input value={purpose} onChange={e => setPurpose(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <Input value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Nationality</Label>
            <Input value={nationality} onChange={e => setNationality(e.target.value)} />
          </div>
        </div>

        <Button
          onClick={async () => {
            try {
              setErr(null);
              await updateProfile({ visaType, purpose, city, nationality });
              await generateTasks();
              nav("/dashboard");
            } catch (e: any) {
              setErr(e.message ?? "Failed");
            }
          }}
        >
          Save & Generate Checklist
        </Button>
      </CardContent>
    </Card>
  );
}
