"use client";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import {
  VideoRowCard,
  VideoRowCardSkleton,
} from "../components/video-row-card";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ErrorBoundary } from "react-error-boundary";

interface SuggestionsSectionsProps {
  videoId: string;
  isManual?: boolean;
}

export const SuggestionsSections = ({
  videoId,
  isManual,
}: SuggestionsSectionsProps) => {
  return (
    <Suspense fallback={<SuggestionsSectionsSkleton />}>
      <ErrorBoundary fallback={<p> Error </p>}>
        <SuggestionsSectionsSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SuggestionsSectionsSkleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoRowCardSkleton key={index} size="compact" />
        ))}
      </div>

      <div className="block md:hidden space-y10">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

export const SuggestionsSectionsSuspense = ({
  videoId,
  isManual,
}: SuggestionsSectionsProps) => {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId: videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          ))
        )}
      </div>

      <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))
        )}
      </div>

      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};
