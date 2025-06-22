import { cn } from "@/lib/utils";
import { ChevronsDownIcon, ChevronUpIcon } from "lucide-react";
import React from "react";

interface VideoDescriptionProps {
  compactViews: string;
  expandedViews: string;
  compactDate: string;
  expandedDate: string;
  description?: string | null;
}

export const VideoDescription = ({
  compactViews,
  expandedViews,
  compactDate,
  expandedDate,
  description,
}: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <div
      onClick={() => setIsExpanded((current) => !current)}
      className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition"
    >
      <div className="flex gap-2 text-sm mb-2">
        <span className="font-bold">
          {isExpanded ? expandedViews : compactViews} views
        </span>
        <span className="font-bold">
          {isExpanded ? expandedDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "texts-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-2"
          )}
        >
          {description || "No description available."}
        </p>
        <div className="flex items-center gap-1 mt-4 text-sm font-medium">
            {
                isExpanded ? (
                    <>
                    Show less <ChevronUpIcon className="size-4" />
                    </>
                ):(
                    <>
                     Show less <ChevronsDownIcon className="size-4" />
                    </>
                )
            }
        </div>
      </div>
    </div>
  );
};
