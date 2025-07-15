import { db } from "@/db";
import { users, videoReactions, videos, videoViews } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";
import { eq, and, or, lt, desc, ilike, getTableColumns } from "drizzle-orm";

export const searchRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        query: z.string().nullish(),
        categoryId: z.string().uuid().optional().nullable(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.string().datetime(),
          })
          .optional(), // no need for nullable() if optional()
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit, query, categoryId } = input;

      const filters = [];

      // Search filter
      if (query) {
        filters.push(ilike(videos.title, `%${query}%`));
      }

      // Category filter
      if (categoryId) {
        filters.push(eq(videos.categoryId, categoryId));
      }

      // Cursor pagination logic
      if (cursor) {
        filters.push(
          or(
            lt(videos.updatedAt, new Date(cursor.updatedAt)),
            and(
              eq(videos.updatedAt, new Date(cursor.updatedAt)),
              lt(videos.id, cursor.id)
            )
          )
        );
      }

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items.at(-1);

      const nextCursor =
        hasMore && lastItem
          ? {
              id: lastItem.id,
              updatedAt: lastItem.updatedAt.toISOString(),
            }
          : null;

      return {
        items,
        nextCursor,
      };
    }),
});
