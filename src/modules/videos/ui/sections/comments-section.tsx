"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import CommentItems from "@/modules/comments/ui/components/comment-items";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionsProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionsProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkleton />}>
      <ErrorBoundary fallback={<p>Error loading comments...</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CommentsSectionSkleton = () => {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader2Icon className="text-muted-foreground size-7  animate-spin" />
    </div>
  );
};

export const CommentsSectionSuspense = ({ videoId }: CommentsSectionsProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId: videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          {comments.pages[0].totalCount} comments
        </h1>

        <CommentForm videoId={videoId} onSuccess={() => {}} />
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {comments.pages
          .flatMap((page) => page.items)
          .map((comment) => (
            <CommentItems key={comment.id} comment={comment} />
          ))}
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
