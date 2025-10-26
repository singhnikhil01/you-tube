import { UserGetOneOutput } from "../../types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";

interface UserPageBannerProps {
  user: UserGetOneOutput;
}
export const UserPageInfoSkleton = () => {
  return <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh]" />;
};

export const UserPageInfoSkeleton = () => {
  return (
    <div className="py-6">
      {/* mobile Layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
            <Skeleton className="h-[60px] w-[60px] rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="w-full mt-3 h-10 rounded-full" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden items-start gap-4 md:flex">
        <Skeleton className="h-[96px] w-[96px] rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-72 mb-6" />
          <Skeleton className="w-32 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const UserPageInfo = ({ user }: UserPageBannerProps) => {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });
  return (
    <div className="py-6">
      {/* mobile Layout */}

      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-[60px] w-[60px]"
            onClick={() => {
              if (user.clerkId === userId) {
                clerk.openUserProfile();
              }
            }}
          />

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{user.name}</h1>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span> {user.subscriberCount} subscribers</span>
              <span>&bull;</span>
              <span>{user.videoCount} videos</span>
            </div>
          </div>
        </div>

        {userId == user.clerkId ? (
          <Button
            variant={"secondary"}
            asChild
            className="w-full mt-3 rounded-full"
          >
            <Link href={`/studio`}>Go to studio</Link>
          </Button>
        ) : (
          <SubscriptionButton
            onClick={onClick}
            disabled={isPending || !isLoaded}
            isSubscribed={user.viewerSubscribed}
            className="w-full mt-3"
          />
        )}
      </div>

      {/* Desktop Layout */}

      <div className="hidden items-start gap-4 md:flex">
        <UserAvatar
          size="xl"
          imageUrl={user.imageUrl}
          name={user.name}
          className={cn(
            userId === user.clerkId &&
              "cursor-pointer hover:opacity-80 transition-opacity duration-300 "
          )}
          onClick={() => {
            if (user.clerkId === userId) {
              clerk.openUserProfile();
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{user.name}</h1>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <span> {user.subscriberCount} subscribers</span>
            <span>&bull;</span>
            <span>{user.videoCount} videos</span>
          </div>

          {userId == user.clerkId ? (
            <Button variant={"secondary"} asChild className="mt-6 rounded-full">
              <Link href={`/studio`}>Go to studio</Link>
            </Button>
          ) : (
            <SubscriptionButton
              onClick={onClick}
              disabled={isPending || !isLoaded}
              isSubscribed={user.viewerSubscribed}
              className="mt-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};
