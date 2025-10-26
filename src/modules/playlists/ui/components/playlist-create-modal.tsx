import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenchange: (open: boolean) => void;
}
const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistCreateModal = ({
  open,
  onOpenchange,
}: PlaylistCreateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { handleSubmit } = form;

  const utils = trpc.useUtils();
  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      toast.success("Playlist created", {});
      form.reset();
      onOpenchange(false);
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
    onOpenchange(false);
  };

  return (
    <ResponsiveModal
      title="Create a playlist"
      open={open}
      onOpenChange={onOpenchange}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My favourite Videos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={create.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
