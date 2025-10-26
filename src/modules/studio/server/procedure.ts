import { db } from "@/db";
import {
  comments,
  users,
  videoReactions,
  videos,
  videoViews,
} from "@/db/schema";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { eq, and, or, lt, desc, getTableColumns } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { id } = input;
      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));
      if (!video) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
      }
      return video;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.string().datetime(), // Accept ISO string
          })
          .nullable()
          .optional(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const userId = ctx.user.id;
      const baseCondition = eq(videos.userId, userId);

      const cursorCondition = cursor
        ? or(
            lt(videos.updatedAt, new Date(cursor.updatedAt)),
            and(
              eq(videos.updatedAt, new Date(cursor.updatedAt)),
              lt(videos.id, cursor.id)
            )
          )
        : undefined;

      const finalCondition = cursorCondition
        ? and(baseCondition, cursorCondition)
        : baseCondition;

      const data = await db
        .select({
          ...getTableColumns(videos),
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          commentCount: db.$count(comments, eq(comments.videoId, videos.id)),
          user: users,
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .where(finalCondition)
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1); // Fetch one extra to check for next page

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items.at(-1);

      const nextCursor =
        hasMore && lastItem
          ? {
              id: lastItem.id,
              updatedAt: lastItem.updatedAt.toISOString(), // Return as string
            }
          : null;

      return {
        items,
        nextCursor,
      };
    }),
});
