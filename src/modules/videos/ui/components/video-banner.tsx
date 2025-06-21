import React from "react";
import { AlertTriangle } from "lucide-react";
import { VideoGetOneOutput } from "../../types";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

export const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status === "ready") {
    return null;
  }
  return (
    <div className="bg-yellow-500 py-4 px-4 rounded-b-xl flex items-center gap-2">
      <AlertTriangle className="size-4 text-black shrink-0" />
      <p className="text-xs md:text-sm font-medium text-black line-clamp-2">
        This video is currently processing. Please check back later.
      </p>
    </div>
  );
};
