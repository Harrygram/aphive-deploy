import * as React from "react";
import {
  FlameIcon,
  HomeIcon,
  Minus,
  Plus,
  SunMoonIcon,
  TrendingUpIcon,
} from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CreateCommunityButton from "./header/CreateCommunityButton";
import { getJoinedSubreddits } from "@/app/subreddit/joinedSubreddit";
import { currentUser } from "@clerk/nextjs/server";

type SidebarData = {
  navMain: {
    title: string;
    url: string;
    items: {
      title: string;
      url: string;
      isActive: boolean;
    }[];
  }[];
};

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  if (!user?.id) return null;

  const subreddits = await getJoinedSubreddits(user.id);

  const sidebarData: SidebarData = {
    navMain: [
      {
        title: "Joined Communities",
        url: "#",
        items: subreddits.map((subreddit) => ({
          title: subreddit.title || "unknown",
          url: `/community/${subreddit.slug}`,
          isActive: false,
        })),
      },
    ],
  };

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
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <CreateCommunityButton />
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5.5">
                <Link href="/home">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/created-posts">
                  <Clock className="w-4 h-4 mr-2" />
                  Posts Created
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/explore">
                  <TrendingUpIcon className="w-4 h-4 mr-2" />
                  Explore/Match
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/hot">
                  <FlameIcon className="w-4 h-4 mr-2" />
                  Event Feed
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/theme">
                  <SunMoonIcon className="w-4 h-4 mr-2" />
                  Colour Theme
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            {sidebarData.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 0}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.isActive}
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
