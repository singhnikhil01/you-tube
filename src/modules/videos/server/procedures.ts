import { db } from "@/db";
// import { z } from "zod";
import { videos } from "@/db/schema";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
// import { TRPCError } from "@trpc/server";
// import { eq, and, or, lt, desc } from "drizzle-orm";

// import { TRPCError } from "@trpc/server";

export const VideosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    // throw new TRPCError({ code: "BAD_REQUEST", message:"specific message" });
    const { id: userId } = ctx.user;
    const [video] = await db
      .insert(videos)
      .values({
        userId: userId,
        title: "Untitled",
      })
      .returning();
    return {
      video: video,
    };
  }),
});
