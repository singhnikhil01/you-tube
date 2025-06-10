import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { DEFAULT_LIMIT } from "@/constants";

const page = async () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default page;
