"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton
} from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard , VideoRowCardSkleton} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const LikedVideosSection = () => {
  return (
    <Suspense fallback={<LikedVideoSectionSkleton />}>
      <ErrorBoundary fallback={<p>Error loading videos...</p>}>
        <LikedVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const LikedVideoSectionSkleton = () => {
  return (
    <div>
      <div
        className="flex flex-col gap-4 gap-y-10 md:hidden
    "
      >
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
       <div
        className="hidden  flex-col gap-4  md:flex
    "
      >
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkleton key={index}  size="compact"/>
        ))}
      </div>
    </div>
  );
};

export const LikedVideosSectionSuspense = () => {
  const [videos, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <div
        className="flex flex-col gap-4 gap-y-10 md:hidden
    "
      >
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
            <div
        className=" hidden  flex-col gap-4  md:flex
    "
      >
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size={"compact"} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
