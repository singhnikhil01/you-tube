import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthings";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenchange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenchange,
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();
  const onUploadComplete = ( ) => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });
    onOpenchange(false);
  };

  return (
    <ResponsiveModal
      title="Upload Thumbnail"
      open={open}
      onOpenChange={onOpenchange}
    >
      <UploadDropzone
        endpoint={"thumbnailUploader"}
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
