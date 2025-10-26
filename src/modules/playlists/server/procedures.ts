import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import {
  playlists,
  users,
  videoReactions,
  videos,
  videoViews,
  playlistVideos,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, or, sql } from "drizzle-orm";
import z from "zod";

export const PlaylistsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { playlistId } = input;
      const { id: userId } = ctx.user;

      const [deletedPlaylist] = await db
        .delete(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)))
        .returning();

      if (!deletedPlaylist) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return deletedPlaylist;
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { playlistId } = input;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }
      return existingPlaylist;
    }),

  getVideos: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.string().datetime(),
          })
          .optional(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit, playlistId } = input;
      const filters = [];

      // Ensure playlist exists and belongs to user
      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const VideosFromPlaylist = db.$with("playlist_videos").as(
        db
          .select({
            videoId: playlistVideos.videoId,
          })
          .from(playlistVideos)
          .where(eq(playlistVideos.playlistId, playlistId))
      );

      // Visibility filter
      filters.push(eq(videos.visibility, "public"));

      // ✅ Cursor pagination filter
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
        .with(VideosFromPlaylist)
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
        .innerJoin(
          VideosFromPlaylist,
          eq(videos.id, VideosFromPlaylist.videoId)
        )
        .where(and(...filters))
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

  addVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { playlistId, videoId } = input;
      const { id: userId } = ctx.user;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

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

      const [existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        );

      if (existingPlaylistVideo) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Video already in playlist",
        });
      }

      const [createdPlaylistVideo] = await db
        .insert(playlistVideos)
        .values({
          playlistId,
          videoId,
        })
        .returning();

      if (!createdPlaylistVideo) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return createdPlaylistVideo;
    }),

  removeVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { playlistId, videoId } = input;
      const { id: userId } = ctx.user;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

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

      const [existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        );

      if (!existingPlaylistVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not in playlist",
        });
      }

      const [deletedPlaylistVideo] = await db
        .delete(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        )
        .returning();

      if (!deletedPlaylistVideo) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return deletedPlaylistVideo;
    }),

  getManyForVideo: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.string().datetime(),
          })
          .optional(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit, videoId } = input;

      console.log(videoId);
      console.log(videoId);

      const data = await db
        .select({
          ...getTableColumns(playlists),
          videoCount: db.$count(
            playlistVideos,
            eq(playlists.id, playlistVideos.playlistId)
          ),
          user: users,
          containsVideo: videoId
            ? sql<boolean>`(
          SELECT EXISTS (
            SELECT 1
            FROM ${playlistVideos} pv 
            WHERE pv.playlist_id = ${playlists.id} AND pv.video_id = ${videoId}
        ))`
            : sql<boolean>`(FALSE)`,
        })

        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, new Date(cursor.updatedAt)),
                  and(
                    eq(playlists.updatedAt, new Date(cursor.updatedAt)),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )

        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
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

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.string().datetime(),
          })
          .optional(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit } = input;

      const baseWhere = eq(playlists.userId, userId);

      const paginationWhere = cursor
        ? or(
            lt(playlists.updatedAt, new Date(cursor.updatedAt)),
            and(
              eq(playlists.updatedAt, new Date(cursor.updatedAt)),
              lt(playlists.id, cursor.id)
            )
          )
        : undefined;

      const finalWhere = paginationWhere
        ? and(baseWhere, paginationWhere)
        : baseWhere;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          videoCount: db.$count(
            playlistVideos,
            eq(playlists.id, playlistVideos.playlistId)
          ),
          user: users,
          thumbnailUrl: sql<string | null>`(
          SELECT v.thumbnail_url
          FROM ${playlistVideos} pv
          JOIN ${videos} v ON pv.video_id = v.id
          WHERE pv.playlist_id = ${playlists.id}
          ORDER BY pv.updated_at DESC
          LIMIT 1
          )`,
        })
        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .where(finalWhere)
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
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

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      const { id: userId } = ctx.user;
      const [createdPlaylist] = await db
        .insert(playlists)
        .values({
          userId,
          name,
        })
        .returning();

      if (!createdPlaylist) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return createdPlaylist;
    }),

  getLiked: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            likedAt: z.string().datetime(), // consistent field name
          })
          .optional(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit } = input;
      const filters = [];

      const viewerVideoReactions = db.$with("viewer_liked_videos").as(
        db
          .select({
            videoId: videoReactions.videoId,
            likedAt: videoReactions.updatedAt,
          })
          .from(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like")
            )
          )
      );

      // Cursor pagination
      if (cursor) {
        filters.push(
          or(
            lt(viewerVideoReactions.likedAt, new Date(cursor.likedAt)),
            and(
              eq(viewerVideoReactions.likedAt, new Date(cursor.likedAt)),
              lt(videos.id, cursor.id)
            )
          )
        );
      }

      filters.push(eq(videos.visibility, "public"));

      const data = await db
        .with(viewerVideoReactions)
        .select({
          ...getTableColumns(videos),
          user: users,
          likedAt: viewerVideoReactions.likedAt,
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
        .innerJoin(
          viewerVideoReactions,
          eq(videos.id, viewerVideoReactions.videoId)
        )
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(viewerVideoReactions.likedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items.at(-1);

      const nextCursor =
        hasMore && lastItem
          ? {
              id: lastItem.id,
              likedAt: lastItem.likedAt.toISOString(),
            }
          : null;

      return {
        items,
        nextCursor,
      };
    }),

  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            viewedAt: z.string().datetime(),
          })
          .optional(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit } = input;
      const filters = [];

      const viewerVideoViews = db.$with("viewer_video_views").as(
        db
          .select({
            videoId: videoViews.videoId,
            viewedAt: videoViews.updatedAt,
          })
          .from(videoViews)
          .where(eq(videoViews.userId, userId))
      );

      // Cursor pagination
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
              viewedAt: lastItem.viewedAt.toISOString(),
            }
          : null;

      return {
        items,
        nextCursor,
      };
    }),
});
