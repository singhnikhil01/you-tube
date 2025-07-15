"use client";
import React from "react";

import Muxplayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "../../constants";
import Image from "next/image";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}
export const VideoPlayerSkeleton = () => {
  return <div className="aspect-video bg-black rounded-xl" />;
};
export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  onPlay,
  autoPlay,
}: VideoPlayerProps) => {
  if (!playbackId) {
    return (
      <div className="text-red-500">
        Playback ID is Not Avaliable
        <Image
          src={THUMBNAIL_FALLBACK}
          alt="Thumbnail fallback"
          width={640}
          height={360}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <Muxplayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      thumbnailTime={0}
      autoPlay={autoPlay}
      onPlay={onPlay}
      className="w-full h-full object-contain"
      style={{ aspectRatio: "16/9" }}
      accentColor="@FF2056"
    />
  );
};
