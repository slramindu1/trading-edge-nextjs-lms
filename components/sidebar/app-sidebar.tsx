"use client";

import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
  type Icon as TablerIcon,
} from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Logo from "@/app/logo-white.png";
import Image from "next/image";

// Define props interface
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}

// Remove hardcoded data and define nav items separately
const navMainItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: IconDashboard as TablerIcon,
  },
  {
    title: "Students",
    url: "/admin/student", // Fixed: Added leading slash
    icon: IconUsers as TablerIcon,
  },
  {
    title: "Announcements",
    url: "#",
    icon: IconUsers as TablerIcon,
  },
  {
    title: "NewsLetter",
    url: "#",
    icon: IconUsers as TablerIcon,
  },
];

const navSecondaryItems = [
  {
    title: "Settings",
    url: "#",
    icon: IconSettings as TablerIcon,
  },
  {
    title: "Get Help",
    url: "#",
    icon: IconHelp as TablerIcon,
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch as TablerIcon,
  },
];

// Default user data as fallback
const defaultUser = {
  name: "Admin User",
  email: "admin@example.com",
  avatar: "/",
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Use provided user or default
  const currentUser = user || defaultUser;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <Image 
                  src={'/'} 
                  alt="logo" 
                  width={196} 
                  height={186}
                  className="h-12 w-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}