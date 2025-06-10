import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/proceduce";
import { VideosRouter } from "@/modules/videos/server/procedures";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: VideosRouter,
  categories: categoriesRouter,
});
export type AppRouter = typeof appRouter;
