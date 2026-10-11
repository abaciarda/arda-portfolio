import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret)
    return Response.json(
      { error: "Webhook is not configured" },
      { status: 503 },
    );
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature)
    return Response.json({ error: "Missing signature" }, { status: 401 });
  const body = await request.text();
  try {
    if (!(await isValidSignature(body, signature, secret)))
      return Response.json({ error: "Invalid signature" }, { status: 401 });
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
  revalidateTag("sanity-content", { expire: 0 });
  return Response.json({ revalidated: true });
}
