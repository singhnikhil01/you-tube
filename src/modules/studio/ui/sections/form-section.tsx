"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { z } from "zod";

import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcw,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { VideoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";
import { ThumbnailGenerateModal } from "../components/thumbnail-generate-modal";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error loading form section...</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const FormSectionSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <Skeleton className="h-8 bg-gray-200 rounded w-48 mb-2"></Skeleton>
          <Skeleton className="h-4 bg-gray-200 rounded w-64"></Skeleton>
        </div>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-10 bg-gray-200 rounded w-16"></Skeleton>
          <Skeleton className="h-10 w-10 bg-gray-200 rounded"></Skeleton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-4 bg-gray-200 rounded w-16"></Skeleton>
            <Skeleton className="h-10 bg-gray-200 rounded w-full"></Skeleton>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 bg-gray-200 rounded w-24"></Skeleton>
            <Skeleton className="h-40 bg-gray-200 rounded w-full"></Skeleton>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 bg-gray-200 rounded w-20"></Skeleton>
            <Skeleton className="h-10 bg-gray-200 rounded w-full"></Skeleton>
          </div>
        </div>

        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4 flex flex-col gap-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 bg-gray-200 rounded w-20"></Skeleton>
                <Skeleton className="h-4 bg-gray-200 rounded w-full"></Skeleton>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 bg-gray-200 rounded w-24"></Skeleton>
                <Skeleton className="h-4 bg-gray-200 rounded w-20"></Skeleton>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 bg-gray-200 rounded w-24"></Skeleton>
                <Skeleton className="h-4 bg-gray-200 rounded w-20"></Skeleton>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const utils = trpc.useUtils();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video updated successfully");
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video removed successfully");
      router.push("/studio");
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail restored successfully");
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });



  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: "You will be notified when the thumbnail is ready",
      });
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });

  const generateDescription = trpc.videos.generateDescriptions.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: "You will be notified when the thumbnail is ready",
      });
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });

  const form = useForm<z.infer<typeof VideoUpdateSchema>>({
    resolver: zodResolver(VideoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = async (data: z.infer<typeof VideoUpdateSchema>) => {
    await update.mutateAsync(data);
    form.reset(data);
  };

  const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/video/${
    video.id
  }`;

  const [isCopied, setIsCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setIsCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  const [thumbnailModelOpen, setThumbnailModelOpen] = useState(false);
  const [thumbnailGenerateModalOpen, setThumbnailGenerateOpen] =
    useState(false);

  return (
    <>
     <ThumbnailGenerateModal
        open={thumbnailGenerateModalOpen}
        onOpenchange={setThumbnailGenerateOpen}
        videoId={videoId}
      />
      <ThumbnailUploadModal
        open={thumbnailModelOpen}
        onOpenchange={setThumbnailModelOpen}
        videoId={videoId}
      />
     
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div className="">
              <h1 className="text-2xl font-bold">Video Details</h1>
              <p className="text-xs text-muted-foreground">
                Manage your video Details
              </p>
            </div>

            <div className="flex items-center gap-x-2 ">
              <Button type="submit" disabled={update.isPending}>
                Save
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: video.id })}
                  >
                    <TrashIcon className="size-4  mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
                          size={"icon"}
                          variant="outline"
                          type="button"
                          className="rounded-full size-6 [&_svg]:size-3"
                          onClick={() => generateTitle.mutate({ id: video.id })}
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                        >
                          {generateTitle.isPending ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add title to your video"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Description
                        <Button
                          size={"icon"}
                          variant="outline"
                          type="button"
                          className="rounded-full size-6 [&_svg]:size-3"
                          onClick={() =>
                            generateDescription.mutate({ id: video.id })
                          }
                          disabled={
                            generateDescription.isPending || !video.muxTrackId
                          }
                        >
                          {generateDescription.isPending ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a description to your video"
                        rows={10}
                        className="resize-none pr-10"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO:Add thumbnail field here */}

              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0 5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                          fill
                          alt="Thumbnail"
                          className="object-cover"
                          unoptimized={!!video.thumbnailUrl}
                        />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size={"icon"}
                              variant="ghost"
                              className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100"
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              onClick={() => setThumbnailModelOpen(true)}
                            >
                              <ImagePlusIcon className="size-4 mr-1" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setThumbnailGenerateOpen(true)
                              }
                            >
                              <SparklesIcon className="size-4 mr-1" />
                              AI Generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                restoreThumbnail.mutate({ id: video.id });
                              }}
                            >
                              <RotateCcw className="size-4 mr-1" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category
                      {/* TODO: ADD AI generated button */}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="end" side="bottom">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                    autoPlay={false}
                  />
                </div>

                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2 ">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground">Video link</p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/video/${video.id}`} className="">
                          <p className="line-clamp-1 text-sm text-blue-500 hover:underline">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 transition active:scale-95 "
                          onClick={() => onCopy()}
                          aria-label="Copy video link"
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        video status
                      </p>
                      <p>{snakeCaseToTitle(video.muxStatus || "preparing")}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Track status
                      </p>
                      <p>
                        {snakeCaseToTitle(
                          video.muxTrackStatus || "no_subtitle"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Visibility
                      {/* TODO: ADD AI generated button */}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Visiblity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="end" side="bottom">
                        <SelectItem value="public">
                          <div className="flex items-center">
                            <Globe2Icon className="size-4 mr-2" /> Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <LockIcon className="size-4 mr-2" /> Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
