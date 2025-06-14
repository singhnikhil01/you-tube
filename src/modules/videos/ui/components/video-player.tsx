"use client";
import React from "react";

import Muxplayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "../../constants";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  onPlay,
  autoPlay,
}: VideoPlayerProps) => {
  if (!playbackId) {
    return <div className="text-red-500">Playback ID is required</div>;
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
