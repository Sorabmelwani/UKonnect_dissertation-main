import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getDashboard } from "./tasksApi";

export function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboard().then(r => setData(r.dashboard)).catch(() => setData(null));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent>{data.total}</CardContent></Card>
        <Card><CardHeader><CardTitle>Completed</CardTitle></CardHeader><CardContent>{data.completed}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent>{data.pending}</CardContent></Card>
        <Card><CardHeader><CardTitle>Progress</CardTitle></CardHeader><CardContent>{data.completionRate}%</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Upcoming tasks</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.upcoming.map((t: any) => (
            <div key={t.id} className="text-sm border rounded p-2">
              <div className="font-medium">{t.title}</div>
              <div className="text-muted-foreground">{t.category} • due {t.dueAt?.slice(0,10)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
