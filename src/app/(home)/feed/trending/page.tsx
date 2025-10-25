import { HydrateClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import TrendingView from "@/modules/home/ui/views/trending-view";
export const dynamic = "force-dynamic";


const Page = () => {
  void trpc.videos.getManyTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT, // Assuming a default limit, adjust as necessary
  });
  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default Page;
