import { db } from "@/db";
import {
  protectedProcedure,
  createTRPCRouter,
  baseProcedure,
} from "@/trpc/init";
import { comments, users } from "@/db/schema";
import { eq, desc, getTableColumns, or, lt, and, count } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        value: z.string().min(1, "Comment cannot be empty"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId, value } = input;
      const [createdComment] = await db
        .insert(comments)
        .values({
          userId,
          videoId,
          value,
        })
        .returning();
      return createdComment;
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Comment not found or you do not have permission to delete it",
        });
      }
      return deletedComment;
    }),

  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.string().datetime(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { videoId, cursor, limit } = input;

      const [commentsList, totalData] = await Promise.all([
        await db
          .select({
            ...getTableColumns(comments),
            user: users,
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, new Date(cursor.updatedAt)),
                    and(
                      eq(comments.updatedAt, new Date(cursor.updatedAt)),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )

          .innerJoin(users, eq(comments.userId, users.id))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),

        await db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
      ]);

      const hasMore = commentsList.length > limit;
      const items = hasMore ? commentsList.slice(0, -1) : commentsList;

      const lastItem = items.at(-1);

      const nextCursor =
        hasMore && lastItem
          ? {
              id: lastItem.id,
              updatedAt: lastItem.updatedAt.toISOString(), // Return as string
            }
          : null;

      return {
        totalCount: totalData[0]?.count || 0,
        items,
        nextCursor,
      };
    }),
});
