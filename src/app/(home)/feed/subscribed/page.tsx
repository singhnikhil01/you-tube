import { HydrateClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import SubscribedView from "@/modules/home/ui/views/subscribed-view";
export const dynamic = "force-dynamic";


const Page = () => {
  void trpc.videos.getManySubscribed.prefetchInfinite({
    limit: DEFAULT_LIMIT, // Assuming a default limit, adjust as necessary
  });
  return (
    <HydrateClient>
      <SubscribedView />
    </HydrateClient>
  );
};

export default Page;
