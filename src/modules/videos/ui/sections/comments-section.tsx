"use client";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import CommentItems from "@/modules/comments/ui/components/comment-tems";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionsProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionsProps) => {
  return (
    <Suspense fallback={<div>Loading comments...</div>}>
      <ErrorBoundary fallback={<p>Error loading comments...</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CommentsSectionSuspense = ({ videoId }: CommentsSectionsProps) => {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({
    videoId,
  });
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">0 commnets</h1>

        <CommentForm videoId={videoId} onSuccess={() => {}} />
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {comments.map((comment) => (
          <CommentItems key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
