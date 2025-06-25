import { CommentsSection } from "../sections/comments-section";
import { SuggestionsSections } from "../sections/suggestions-sections";
import { VideoSection } from "../sections/video-section";

interface VideoViewsProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewsProps) => {
  return (
    <div className="flex flex-col max-w-[1700px] z-40 pt-2.5 px-4 mb-10">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />

          <div className="xl:hidden block mt-4">
            <SuggestionsSections />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionsSections />
        </div>
      </div>
    </div>
  );
};
