import { VideoSection } from "../sections/video-section";

interface VideoViewsProps {

    videoId: string;
}


export const VideoView = ({ videoId }: VideoViewsProps) => {
     return (
        <div className="flex flex-col max-w-[1200px] z-40 pt-2.5 px-4 mb-10">
            <div className="flex flex-col xl:flex-row gap-6">
                 <div className="flex-1 min-w-0">
                    <VideoSection videoId={videoId}/>
                 </div>
            </div>
        </div>
     )
}