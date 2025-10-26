import { PlaylistGetManyOutput } from "@/modules/playlists/types";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import Link from "next/link";
import { PlaylistThumbnail } from "./playlist-thumbnail";
import { PlaylistInfo, PlaylistInfoSkleton } from "./playlist-info";

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCardSkleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <PlaylistGridCardSkleton />
      <PlaylistInfoSkleton/>
    </div>
  );
};
export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          thumbnailUrl={data.thumbnailUrl || THUMBNAIL_FALLBACK}
          title={data.name}
          videoCount={data.videoCount}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};
