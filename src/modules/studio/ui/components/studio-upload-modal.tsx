"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StudioUploadModel = () => {
  return (
    <Button variant={"secondary"} className="rounded-full ">
      <PlusIcon />
      Create
    </Button>
  );
};
