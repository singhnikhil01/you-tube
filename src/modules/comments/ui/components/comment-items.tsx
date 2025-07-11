import React from "react";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommentItemsProps {
  key: string;
  comment: CommentsGetManyOutput["items"][number];
}

const CommentItems = ({ comment }: CommentItemsProps) => {
  const { userId } = useAuth();
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("You must be logged in to delete a comment.");
      } else {
        toast.error("something went wrong" + error.message);
      }
    },
  });
  const like = trpc.commentReactions.like.useMutation({
    onSuccess:()=>{
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong"+error.message);
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("You must be logged in to like a comment.");
      }
    }
  })
  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess:()=>{
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("You must be logged in to like a comment.");
      }
    }
  })
  return (
    <div className="">
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size={"lg"}
            imageUrl={comment.user.imageUrl || "./user_placeholder.svg"}
            className={"cursor-pointer"}
            name={comment.user.name || "User"}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name || "User"}
              </span>
              <span className="text-xs text-muted-foreground">
                {/* @{comment.user.username} */}
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Button
                disabled={like.isPending}
                variant="ghost"
                size={"icon"}
                className="size-8"
                onClick={() => like.mutate({ commentId: comment.id })}
              >

                <ThumbsUpIcon
                className={cn(comment.viewerReaction==="like" && "fill-black")}
                />
              </Button>
              <span className="text-xs text-muted-foreground">{comment.likeCount}</span>
              <Button
                disabled={dislike.isPending}
                variant="ghost"
                size={"icon"}
                className="size-8"
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >

                <ThumbsDownIcon
                className={cn(comment.viewerReaction==="dislike" && "fill-black")}
                />
              </Button>
              <span className="text-xs text-muted-foreground">{comment.dislikeCount}</span>
            </div>
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {comment.user.clerkId === userId && (
              <DropdownMenuItem
                onClick={() => remove.mutate({ id: comment.id })}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CommentItems;
