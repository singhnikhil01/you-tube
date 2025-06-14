import { db } from "@/db";
// import { z } from "zod";
import { videos, VideoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";
// import { eq, and, or, lt, desc } from "drizzle-orm";

import { TRPCError } from "@trpc/server";
import z from "zod";

export const VideosRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const {id: userId } = ctx.user;
      const [removedVideo] = await db.delete(videos).where(
        and(eq(videos.id, input.id), eq(videos.userId, userId))
      ).returning();
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
