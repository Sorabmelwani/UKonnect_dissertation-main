import { prisma } from "../lib/prisma.js";

type ContextItem = { type: string; title: string; content: string; url?: string | null };

export async function buildContext(userId: string, question: string): Promise<ContextItem[]> {
  const me = await prisma.profile.findUnique({ where: { userId } });

  const q = question.trim().slice(0, 200);

  const faqs = await prisma.faqEntry.findMany({
    where: {
      OR: [
        { topic: { contains: q, mode: "insensitive" } },
        { question: { contains: q, mode: "insensitive" } }
      ]
    },
    take: 5
  });

  const services = me?.city
    ? await prisma.localService.findMany({
        where: { city: { contains: me.city, mode: "insensitive" } },
        take: 5
      })
    : [];

  const tasks = await prisma.userTask.findMany({
    where: { userId },
    orderBy: { dueAt: "asc" },
    take: 5
  });

  const ctx: ContextItem[] = [];

  for (const f of faqs) {
    ctx.push({ type: "faq", title: f.question, content: f.answer, url: f.officialUrl });
  }
  for (const s of services) {
    ctx.push({ type: "service", title: s.name, content: `${s.category} in ${s.city}. ${s.description ?? ""}`, url: s.website });
  }
  for (const t of tasks) {
    ctx.push({ type: "task", title: t.title, content: `${t.category} • ${t.status} • due ${t.dueAt ? t.dueAt.toISOString().slice(0,10) : "n/a"}` });
  }

  return ctx;
}

/**
 * MVP response generator without an LLM:
 * - Uses retrieval context and produces a structured response.
 * This keeps the system functional even without API keys.
 */
export function simpleAnswer(question: string, context: ContextItem[]) {
  const lines: string[] = [];
  lines.push("Here’s what I can suggest based on the info available in the app (not legal advice):");
  lines.push("");
  lines.push(`Question: ${question}`);
  lines.push("");

  if (!context.length) {
    lines.push("I don’t have a matching FAQ in the database yet. Try checking GOV.UK/NHS official pages, or ask a more specific question (city + visa type + task).");
    return { answer: lines.join("\n"), sources: [] as ContextItem[] };
  }

  lines.push("Relevant items:");
  context.slice(0, 8).forEach((c, i) => {
    lines.push(`${i + 1}. [${c.type}] ${c.title} — ${c.content}${c.url ? ` (${c.url})` : ""}`);
  });

  lines.push("");
  lines.push("If you want, I can convert this into a step-by-step checklist for your profile.");

  return { answer: lines.join("\n"), sources: context };
}
