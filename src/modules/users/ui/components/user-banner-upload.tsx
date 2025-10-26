import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthings";
import { trpc } from "@/trpc/client";

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenchange: (open: boolean) => void;
}

export const BannerUploadModal = ({
  userId,
  open,
  onOpenchange,
}: BannerUploadModalProps) => {
  const utils = trpc.useUtils();
  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: userId });
    onOpenchange(false);
  };

  return (
    <ResponsiveModal
      title="Upload Banner"
      open={open}
      onOpenChange={onOpenchange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
