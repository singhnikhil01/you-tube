import React from "react";
import { FormSection } from "../sections/form-section";

interface VideoViewsProps {
  videoId: string;
}

export const VideoViews = ({ videoId }: VideoViewsProps) => {
  return (
    <div className="px-4 pt-2.5 max-w-screen-lg">
      <FormSection videoId={videoId} />
    </div>
  );
};
