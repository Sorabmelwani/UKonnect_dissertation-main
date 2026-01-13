import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/community/posts`).then(r => r.json()).then(d => setPosts(d.posts ?? []));
  }, []);

  return (
    <div className="space-y-3">
      {posts.map(p => (
        <div key={p.id} className="border rounded p-3">
          <div className="font-medium">{p.title}</div>
          <div className="text-sm text-muted-foreground">{p.body}</div>
          <div className="mt-2 text-sm">
            Replies: {p.replies?.length ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
}
