import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/services?city=London`).then(r => r.json()).then(d => setServices(d.services ?? []));
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Local services</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {services.map(s => (
          <div key={s.id} className="border rounded p-2 text-sm">
            <div className="font-medium">{s.name}</div>
            <div className="text-muted-foreground">{s.category} • {s.city}</div>
            {s.website && <a className="underline" href={s.website} target="_blank">Website</a>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
