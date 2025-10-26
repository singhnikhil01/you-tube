"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
// import { Button } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "react-error-boundary";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}
export const PlaylistHeaderSection = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Failed to load playlist header.</div>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};

const PlaylistHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
    playlistId,
  });

  const utils = trpc.useUtils();
  const router = useRouter();
  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist removed successfully");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: (error) => {
      toast.error("something went wrong: " + error.message);
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-xs text-muted-foreground">
          Videos from the playlist
        </p>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full mr-10"
        onClick={() => {
          remove.mutate({ playlistId });
        }}
        disabled={remove.isPending}
      >
        <Trash2Icon className="" />
      </Button>
    </div>
  );
};
