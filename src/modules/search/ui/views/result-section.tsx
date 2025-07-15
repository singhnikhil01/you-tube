"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  VideoRowCard,
  VideoRowCardSkleton,
} from "@/modules/videos/ui/components/video-row-card";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ResultSectionProps {
  query: string | undefined;
  categoryId?: string | undefined;
}
const ResultSectionSkleton = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoGridCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoRowCardSkleton key={index} />
          ))}
        </div>
      )}
    </>
  );
};

export const ResultSection = ({ query, categoryId }: ResultSectionProps) => {
  return (
    <Suspense fallback={<ResultSectionSkleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <ResultSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const ResultSectionSuspense = ({
  query,
  categoryId,
}: ResultSectionProps) => {
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}

      <InfiniteScroll
        hasNextPage={resultQuery.hasNextPage}
        isFetchingNextPage={resultQuery.isFetchingNextPage}
        fetchNextPage={resultQuery.fetchNextPage}
      />
    </>
  );
};
