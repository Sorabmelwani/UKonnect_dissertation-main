import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { apiFetch } from "../../api/http";
import { loadAuth } from "../auth/authStore";

export function AiChatPage() {
  const [msg, setMsg] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader><CardTitle>AI Assistant</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Ask a question..." />
        <Button
          onClick={async () => {
            const token = loadAuth().accessToken!;
            const res = await apiFetch<{ ok: true; answer: string }>("/ai/chat", {
              method: "POST",
              body: JSON.stringify({ message: msg })
            }, token);
            setAnswer(res.answer);
          }}
        >
          Ask
        </Button>
        {answer && <pre className="text-sm whitespace-pre-wrap border rounded p-3">{answer}</pre>}
      </CardContent>
    </Card>
  );
}
