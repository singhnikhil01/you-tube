import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/proceduce";
import { VideosRouter } from "@/modules/videos/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/server/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedure";
import { subscriptionRouter } from "@/modules/subscriptions/server/procedure";
import { commentsRouter } from "@/modules/comments/server/procedure";
import { commentReactionsRouter } from "@/modules/comment_reactions/server/procedure";
import { suggestionsRouter } from "@/modules/suggestion/server/procedure";
import { searchRouter } from "@/modules/search/server/procedure";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: VideosRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionRouter,
  comments: commentsRouter,
  search: searchRouter,
  suggestions: suggestionsRouter,
  commentReactions: commentReactionsRouter,
});
export type AppRouter = typeof appRouter;
