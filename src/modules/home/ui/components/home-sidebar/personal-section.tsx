"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {  History,  ListVideoIcon,  ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
const items = [
  {
    title: "History",
    url: "/playlist/history",
    icon: History,
    auth:true
  },
  {
    title: "Liked Videos",
    url: "/playlists/liked",
    icon:ThumbsUpIcon,
    auth: true,
  },
  {
    title: "All Playlists",
    url: "/playlists",
    icon: ListVideoIcon,
    auth: true,
  },
];

export const PersonalSection = () => {
  return (
    <SidebarGroup>
        <SidebarGroupLabel className="font-bold  text-lg">
            You
        </SidebarGroupLabel>


      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false} //TODO:change to look at current pathname
                onClick={() => {}} //TODO:Do something on click 
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
