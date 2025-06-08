'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { StudioSidebarHeader } from "./studio-sidebar-header";

export const StudioSidebar = () => {
  const pathname = usePathname();
  return (
    <Sidebar className=" z-40  border-r shadow-md " collapsible="icon"  >{/**collapsible="icon"  */}
      <SidebarContent className="bg-white ">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/">
            <div className="p-4 flex items-center gap-1">
              <Image src="./logo.svg" height={32} width={32} alt="log0" />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader/>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/studio"}
                tooltip="Edit studio"
                asChild
              >
                <Link href={"/studio"}>
                  <VideoIcon className="size-5" />
                  <span className="text-sm">Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator />
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Edit studio"
                asChild
              >
                <Link href={"/"}>
                  <LogOutIcon className="size-5" />
                  <span className="text-sm">Exit studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
