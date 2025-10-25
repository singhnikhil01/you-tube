import React from "react";
import { UserAvatar } from "../../../../components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { trpc } from "@/trpc/client";
import { CommentInsertSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "reply" | "comment";
}

export const CommentForm = ({
  videoId,
  parentId,
  onSuccess,
  onCancel,
  variant = "comment",
}: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const commentSchema = CommentInsertSchema.omit({ userId: true });
  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      toast.success("Comment added successfully!");
      onSuccess?.();
    },

    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("You must be logged in to comment.");
      } else {
        toast.error("Something went worng"+error.message);
      }
    },
  });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      parentId: parentId ,
      videoId,
      value: "",
    },
  });

  const handleSubmit = (value: z.infer<typeof commentSchema>) => {
    create.mutate(value);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-4 group"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size={"lg"}
          imageUrl={user?.imageUrl }
          name={user?.username || "User"}
        />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                        ? "Reply to this Comment..."
                        : "Add a comment..."
                    }
                    className="resize-none  bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            {onCancel && (
              <Button
                variant="ghost"
                onClick={handleCancel}
                type="button"
              >Cancel</Button>
            )}
            <Button type="submit" size={"sm"}>
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
