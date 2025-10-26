import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import React from "react";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { SubscriptionsSection } from "./subscriptions-section";

export const HomeSidebar = () => {
  return (
    <Sidebar className=" z-40 border-none overflow-y-hidden" collapsible="icon">
      <SidebarContent className="bg-white ">
      <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" height={32} width={32} alt="log0" />
              <p className="text-xl font-semibold tracking-tight">NewTube</p>
            </div>
          </Link>
        </div>
        <MainSection />
        <Separator/>
        <PersonalSection />
        <SignedIn>

           <Separator />
           <SubscriptionsSection />
        </SignedIn>
      </SidebarContent>
    </Sidebar>
  );
};
