import * as React from "react"
import {
  Newspaper,
  ChartNoAxesColumn,
} from "lucide-react"

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar as SidebarBase,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  getUser
} from '@/app/auth/actions';

const data = {
  navMain: [
    {
      title: "Statistics",
      url: "/admin",
      icon: ChartNoAxesColumn,
      isActive: false,
      items: []
    },
    {
      title: "Articles",
      url: "/admin/articles",
      icon: Newspaper,
      isActive: true,
      items: [],
    },
  ],
}

export default function Sidebar({ ...props }: React.ComponentProps<typeof SidebarBase>) {
  const user = getUser();
  
  return (
    <SidebarBase variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <h1>Zavod News</h1>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </SidebarBase>
  );
}
