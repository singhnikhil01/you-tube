import { DEFAULT_LIMIT } from "@/constants";
import LikedView from "@/modules/playlists/ui/views/liked-views";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async()=>{
    void trpc.playlists.getLiked.prefetchInfinite({limit: DEFAULT_LIMIT})
    return(
        <HydrateClient>
            <LikedView/>
        </HydrateClient>
    )
}

export default Page;