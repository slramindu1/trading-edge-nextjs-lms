"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamically import components that use Radix/Sidebar
const AppSidebar = dynamic(() => import("@/components/sidebar/app-sidebar").then(m => m.AppSidebar), {
  ssr: false,
});
const SiteHeader = dynamic(() => import("@/components/sidebar/site-header").then(m => m.SiteHeader), {
  ssr: false,
});
const SidebarProvider = dynamic(() => import("@/components/ui/sidebar").then(m => m.SidebarProvider), {
  ssr: false,
});
const SidebarInset = dynamic(() => import("@/components/ui/sidebar").then(m => m.SidebarInset), {
  ssr: false,
});

import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <Toaster position="bottom-right" closeButton />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
