import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { listTasks, patchTask } from "./tasksApi";

export function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  async function load() {
    const res = await listTasks();
    setTasks(res.tasks);
  }

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {tasks.map(t => (
          <div key={t.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-muted-foreground">
                {t.category} • {t.priority} • {t.status} {t.dueAt ? `• due ${t.dueAt.slice(0,10)}` : ""}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={async () => {
                await patchTask(t.id, { status: t.status === "COMPLETED" ? "PENDING" : "COMPLETED" });
                await load();
              }}
            >
              {t.status === "COMPLETED" ? "Mark pending" : "Mark done"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
