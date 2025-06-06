import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = await headers(); // no await
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing Svix headers");
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    const wh = new Webhook(SIGNING_SECRET);
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Could not verify webhook", { status: 400 });
  }

  const eventType = evt.type;
  console.log(`✅ Clerk Webhook Received: ${eventType}`);

  if (eventType === "user.created") {
    const data = evt.data;
    await db.insert(users).values({
      clerkId: data.id,
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      imageUrl: data.image_url,
    });
  }

  if (eventType === "user.deleted") {
    const data = evt.data;
    if (data?.id) {
      await db.delete(users).where(eq(users.clerkId, data.id));
    } else {
      console.warn("User deleted event missing ID:", data);
      return new Response("Missing user id", { status: 400 });
    }
  }

  if (eventType === "user.updated") {
    const data = evt.data;
    await db
      .update(users)
      .set({
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        imageUrl: data.image_url,
      })
      .where(eq(users.clerkId, data.id));
  }

  return new Response("✅ Webhook processed", { status: 200 });
}
