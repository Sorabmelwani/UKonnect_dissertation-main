import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { listDocuments, uploadDocument } from "../tasks/tasksApi";

export function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    const res = await listDocuments();
    setDocs(res.documents);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader><CardTitle>Upload document</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-3">
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button
            onClick={async () => {
              if (!file) return;
              await uploadDocument(file, "OTHER");
              setFile(null);
              await load();
            }}
          >
            Upload
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Your documents</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {docs.map(d => (
            <div key={d.id} className="border rounded p-2 text-sm">
              <div className="font-medium">{d.originalName}</div>
              <div className="text-muted-foreground">{d.category} • {(d.sizeBytes / 1024).toFixed(1)} KB</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
