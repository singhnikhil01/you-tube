"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import {
  SubscriptionItemSkeleton,
  SubscriptionsItems,
} from "../components/subscriptions-items";

export const SubscriptionsViewSection = () => {
  return (
    <Suspense fallback={<SubscriptionsViewSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error loading videos...</p>}>
        <SubscriptionsViewSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const SubscriptionsViewSectionSkeleton = () => {
  return (
    <div
      className="flex flex-col gap-4 
    "
    >
      {Array.from({ length: 18 }).map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </div>
  );
};

export const SubscriptionsViewSectionSuspense = () => {
  const utils = trpc.useUtils();
  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success("Unsubscribed successfully");
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
      utils.videos.getOne.invalidate({ id: data.creatorId });
    },
    onError: (error) => {
      toast.error("something went wrong "+ error.message);
    },
  });

  return (
    <div>
      <div
        className="flex flex-col gap-4 
    "
      >
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              key={subscription.creatorId}
              href={`/users/${subscription.user.id}`}
            >
              <SubscriptionsItems
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscribersCount={subscription.user.subscriberCount}
                onUnsubscribe={() =>
                  unsubscribe.mutate({ userId: subscription.creatorId })
                }
                disabled={unsubscribe.isPending}
              />
            </Link>
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
