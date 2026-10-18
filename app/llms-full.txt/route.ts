import { llmsFull } from "../lib/ai-content";
import { loadAiContent } from "../lib/load-ai-content";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  return new Response(llmsFull(await loadAiContent()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
