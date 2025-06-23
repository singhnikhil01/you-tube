import { db } from "@/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { videoReactions } from "@/db/schema";

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;
      const [existingVideoReactionLike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, "like")
          )
        );

      if (existingVideoReactionLike) {
        const [deleteViewerReactions] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.type, "like")
            )
          )
          .returning();
        return deleteViewerReactions;
      }

      const [createdVideoReactions] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "like",
          },
        })
        .returning();

      return createdVideoReactions;
    }),
  dislike: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;
      const [existingVideoReactionDislike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, "dislike")
          )
        );

      if (existingVideoReactionDislike) {
        const [deleteViewerReactions] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.type, "dislike")
            )
          )
          .returning();
        return deleteViewerReactions;
      }

      const [createdVideoReactions] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "dislike",
          },
        })
        .returning();
      return createdVideoReactions;
    }),
});
