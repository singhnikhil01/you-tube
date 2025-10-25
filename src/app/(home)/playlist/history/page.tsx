import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async()=>{
    void trpc.playlists.getHistory.prefetchInfinite({limit: DEFAULT_LIMIT})
    return(
        <HydrateClient>
            <HistoryView/>
        </HydrateClient>
    )
}