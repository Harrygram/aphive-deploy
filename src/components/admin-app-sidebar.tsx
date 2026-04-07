
import * as React from "react"
import {
  FlameIcon,
  HomeIcon,
  SunMoonIcon,
  TrendingUpIcon,
} from "lucide-react"

import Image from "next/image"
import { UserCog } from "lucide-react"; 
import { Landmark } from "lucide-react";
import { BarChart3 } from "lucide-react";
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src="/aphivehorizontal.png"
                  alt="logo"
                  width={100}
                  height={100}
                  className="flex justify-center"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-5.5">
                <Link href="/admin">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/Manage_Community">
                  <Landmark className="w-4 h-4 mr-2" />
                  Manage Community
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/Manage_User">
                  <UserCog className="w-4 h-4 mr-2" />
                  Manage User
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/report">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reports
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
