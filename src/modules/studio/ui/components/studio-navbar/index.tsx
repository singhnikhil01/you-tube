import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioUploadModel } from "../studio-upload-modal";

export const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex  items-center px-2 pr-5 z-50 ">
      <div className="flex items-center gap-4 w-full">
        {/* {menu and the logo} */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/studio">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" height={32} width={32} alt="logo" />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        {/* {spacer here} */}
        <div className="flex-1">
        </div>

        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModel/>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
