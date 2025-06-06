import React from "react";
import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
interface LayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return (
    <HomeLayout>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </HomeLayout>
  );
};

export default layout;
