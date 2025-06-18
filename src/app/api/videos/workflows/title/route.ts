import { db } from "@/db";
import { serve } from "@upstash/workflow/nextjs";
import { videos } from "../../../../../db/schema";
import { eq, and } from "drizzle-orm";

interface InputType {
  videoId: string;
  userId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const existingVideo = await context.run("get-video", async () => {
    const data = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!data[0]) {
      throw new Error(
        "Video not found or you do not have permission to restore it"
      );
    }
    return data[0];
  });

    await context.run("initial-step", () => {
      console.log("initial step ran");
    });

    await context.run("second-step", () => {
      console.log("second step ran");
    });
});
