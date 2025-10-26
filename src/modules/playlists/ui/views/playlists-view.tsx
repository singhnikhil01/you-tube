"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { PlaylistsSection } from "../sections/play-lists-section";
const PlaylistsView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div className="max-w-[2400px] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6 ">
      <PlaylistCreateModal
        open={createModalOpen}
        onOpenchange={setCreateModalOpen}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Collections you have Created
          </p>
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full mr-10"
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistsSection />
    </div>
  );
};

export default PlaylistsView;
