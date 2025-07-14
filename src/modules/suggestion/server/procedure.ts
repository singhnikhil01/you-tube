import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";
import { eq, and, or, lt, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const suggestionsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            videoId: z.string().uuid(),
            updatedAt: z.string().datetime(),
          })
          .nullable()
          .optional(),
        limit: z.number().min(1).max(100),
        videoId: z.string().uuid(), 
      })
    )
    .query(async ({ input }) => {
      const { videoId, cursor, limit } = input;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      // Construct WHERE conditions safely
      const whereConditions = [];

      // Match same category (if exists)
      if (existingVideo.categoryId) {
        whereConditions.push(eq(videos.categoryId, existingVideo.categoryId));
      }

      // Cursor pagination
      if (cursor) {
        const paginationCondition = or(
          lt(videos.updatedAt, new Date(cursor.updatedAt)),
          and(
            eq(videos.updatedAt, new Date(cursor.updatedAt)),
            lt(videos.id, cursor.id)
          )
        );
        whereConditions.push(paginationCondition);
      }

      const data = await db
        .select()
        .from(videos)
        .where(and(...whereConditions))
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items.at(-1);

      const nextCursor =
        hasMore && lastItem
          ? {
              id: lastItem.id,
              videoId, // Keep passing the current videoId for next page
              updatedAt: lastItem.updatedAt.toISOString(),
            }
          : null;

      return {
        items,
        nextCursor,
      };
    }),
});
