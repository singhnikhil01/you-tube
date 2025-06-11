import { db } from "@/db";
// import { z } from "zod";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
// import { TRPCError } from "@trpc/server";
// import { eq, and, or, lt, desc } from "drizzle-orm";

// import { TRPCError } from "@trpc/server";

export const VideosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    // throw new TRPCError({ code: "BAD_REQUEST", message:"specific message" });

    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        // mp4_support: "standard",
      },
      cors_origin: "*", //TODO: In production set to your URL
    });
    const [video] = await db
      .insert(videos)
      .values({
        userId: userId,
        title: "Untitled",
        muxStatus:"waiting", 
        muxUploadId:upload.id
      })
      .returning();
    return {
      video: video,
      url: upload.url,
    };
  }),
});
