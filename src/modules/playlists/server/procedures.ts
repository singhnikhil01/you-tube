import { db } from "@/db";
import {
  users,
  videoReactions,
  videos,
  videoViews,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import z from "zod";
// import { videoVisiblity } from "@/db/schema";

export const PlaylistsRouter = createTRPCRouter({
  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            viewedAt: z.string().datetime(),
          })
          .optional(), // no need for nullable() if optional()
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;

      const { cursor, limit } = input;
      const filters = [];

      const viewerVideoViews = db.$with("viewer_video_views").as(
        db.select({
          videoId: videoViews.videoId,
          viewedAt: videoViews.updatedAt,
        })
        .from(videoViews)
        .where(eq(videoViews.userId, userId))
      );

      // Cursor pagination logic
      if (cursor) {
        filters.push(
          or(
            lt(viewerVideoViews.viewedAt, new Date(cursor.viewedAt)),
            and(
              eq(viewerVideoViews.viewedAt, new Date(cursor.viewedAt)),
              lt(videos.id, cursor.id)
            )
          )
        );
      }
      filters.push(eq(videos.visibility, "public"));
      const data = await db
      .with(viewerVideoViews)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewedAt: viewerVideoViews.viewedAt,
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
        .innerJoin(viewerVideoViews, eq(videos.id, viewerVideoViews.videoId))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(viewerVideoViews.viewedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items.at(-1);

      const nextCursor =
        hasMore && lastItem
          ? {
              id: lastItem.id,
              viewedAt: lastItem.updatedAt.toISOString(),
            }
          : null;

      return {
        items,
        nextCursor,
      };
    }),
});
