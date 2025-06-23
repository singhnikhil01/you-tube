import { db } from "@/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { videoViews } from "@/db/schema";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;
      const [existingVideoView] = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
        );

      if (existingVideoView) {
        return existingVideoView;
      }

      if (!existingVideoView) {
        const [createdVideoViews] = await db
          .insert(videoViews)
          .values({
            userId,
            videoId,
          })
          .returning();
        return createdVideoViews;
      }
    }),
});
