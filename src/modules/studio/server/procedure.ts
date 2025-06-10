import { db } from "@/db";
import { z } from "zod";
import { videos } from "@/db/schema";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { eq, and, or, lt, desc } from "drizzle-orm";

// import { TRPCError } from "@trpc/server";

export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )

    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        //Add 1 limit+1 to check if there is more data
        .limit(limit+1);
        
      const hasMore = data.length > limit;
      //remove the last item if there is more data

      const items = hasMore ? data.slice(0, -1) : data;
      //Set the next cursor the the last items if there is more data

      const lastItems = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItems.id,
            updatedAt: lastItems.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
