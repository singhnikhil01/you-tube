import { db } from "@/db";
import {
  subscriptions,
  users,
  videoReactions,
  videos,
  VideoUpdateSchema,
  videoViews,
} from "@/db/schema";
import { mux } from "@/lib/mux";
import {
  protectedProcedure,
  createTRPCRouter,
  baseProcedure,
} from "@/trpc/init";
import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  lt,
  or,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/qstash";
// import { videoVisiblity } from "@/db/schema";

export const VideosRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
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
      const { cursor, limit, categoryId } = input;
      const filters = [];

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
      filters.push(eq(videos.visibility, "public"));
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
  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { clerkUserId } = ctx;
      let userId;
      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            videoId: videoReactions.videoId,
            type: videoReactions.type,
          })
          .from(videoReactions)
          .where(inArray(videoReactions.userId, userId ? [userId] : []))
      );

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        db
          .select()
          .from(subscriptions)
          .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
      );

      const [existingvideo] = await db
        .with(viewerReactions, viewerSubscriptions)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, users.id)
            ),
            viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
              Boolean
            ),
          },
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

          viewerReaction: viewerReactions.type, // This will be null if the user has not reacted
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, videos.userId)
        )
        .where(and(eq(videos.id, input.id)));
      // .groupBy(videos.id, users.id, viewerReactions.type);

      if (!existingvideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }
      return existingvideo;
    }),
  generateTitle: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
        body: JSON.stringify({ userId: ctx.user.id, videoId: input.id }),
        headers: {
          "Content-Type": "application/json",
          "x-user-id": ctx.user.id,
        },
        // workflowRunId: `generate-title-${ctx.user.id}`,
        retries: 3,
      });
      return workflowRunId;
    }),

  generateDescriptions: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
        body: JSON.stringify({ userId: ctx.user.id, videoId: input.id }),
        headers: {
          "Content-Type": "application/json",
          "x-user-id": ctx.user.id,
        },
        // workflowRunId: `generate-title-${ctx.user.id}`,
        retries: 3,
      });
      return workflowRunId;
    }),

  generateThumbnail: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        prompt: z.string().min(10, "Prompt is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
        body: JSON.stringify({
          userId: ctx.user.id,
          videoId: input.id,
          prompt: input.prompt,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-user-id": ctx.user.id,
        },
        retries: 3,
      });
      return workflowRunId;
    }),

  revalidate: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Video not found or you do not have permission to restore it",
        });
      }

      if (!existingVideo.muxUploadId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Video does not have a Mux playback ID, cannot restore thumbnail",
        });
      }

      const directUpload = await mux.video.uploads.retrieve(
        existingVideo.muxUploadId
      );

      if (!directUpload || !directUpload.asset_id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mux upload not found",
        });
      }

      const asset = await mux.video.assets.retrieve(directUpload.asset_id);

      if (!asset) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mux asset not found",
        });
      }
      if (asset.status !== "ready") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mux asset is not ready",
        });
      }
      const playbackId = asset.playback_ids?.[0].id;
      const duration = asset.duration ? Math.round(asset.duration * 1000) : 0;
      // TODO: check the track status and also set the track if possible
      const [updatedVideo] = await db
        .update(videos)
        .set({
          muxPlaybackId: playbackId,
          muxStatus: asset.status,
          muxAssetId: asset.id,
          duration: duration,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();
      return updatedVideo;
    }),

  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Video not found or you do not have permission to restore it",
        });
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Video does not have a Mux playback ID, cannot restore thumbnail",
        });
      }
      const tempthumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
      const utapi = new UTApi();
      const uploadedThumbnail = await utapi.uploadFilesFromUrl(
        tempthumbnailUrl
      );

      if (!uploadedThumbnail.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload thumbnail",
        });
      }

      const thumbnail = uploadedThumbnail.data;

      const updatedVideo = await db
        .update(videos)
        .set({
          thumbnailUrl: thumbnail.ufsUrl,
          thumbnailKey: thumbnail.key,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const [removedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();
      if (!removedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found or you do not have permission to delete it",
        });
      }
      // Optionally, you can also delete the video from Mux
    }),
  update: protectedProcedure
    .input(VideoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }
      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          visibility: input.visibility,
          categoryId: input.categoryId,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found or you do not have permission to update it",
        });
      }
      return updatedVideo;
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    // throw new TRPCError({ code: "BAD_REQUEST", message:"specific message" });
    const { id: userId } = ctx.user;
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
        // mp4_support: "standard",
      },
      cors_origin: "*", //TODO: In production set to your URL
    });
    const [video] = await db
      .insert(videos)
      .values({
        userId: userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();
    return {
      video: video,
      url: upload.url,
    };
  }),
});
