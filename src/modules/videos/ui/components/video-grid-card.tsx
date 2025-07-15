import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import { VideoThumbnail, VideoThumbnailSkleton } from "./video-tumbnail";
import { VideoInfo, VideoInfoSkleton } from "./video-info";

interface VideoGridCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <VideoThumbnailSkleton />
      <VideoInfoSkleton />
    </div>
  );
};

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/video/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          title={data.title}
          duration={data.duration}
          previewUrl={data.previewUrl}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};
