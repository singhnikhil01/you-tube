/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { ChevronsDownIcon, ChevronUpIcon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

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
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
            h1: ({ node, ...props }) => (
              <h1 {...props} className="text-blue-600 text-lg font-semibold" />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} className="text-blue-600 text-md font-semibold" />
            ),
            p: ({ node, ...props }) => (
              <p
                {...props}
                className={cn(
                  "texts-sm whitespace-pre-wrap",
                  !isExpanded && "line-clamp-2"
                )}
              />
            ),
          }}
        >
          {description || "No description available."}
        </ReactMarkdown>

        <div className="flex items-center gap-1 mt-4 text-sm font-medium">
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show less <ChevronsDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
