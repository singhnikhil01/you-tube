"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export const StudioUploadModel = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video Created");
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });
  return (
    <Button
      variant="secondary"
      className="rounded-full px-4 py-2 font-semibold flex items-center gap-2  transition-all duration-200 
             hover:bg-secondary/90 active:scale-95 active:shadow-inner
             disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <PlusIcon />
      )}
      Create
    </Button>
  );
};
