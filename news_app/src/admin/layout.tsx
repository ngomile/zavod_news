import {
  Outlet
} from 'react-router-dom';

import Sidebar from "@/admin/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Button
} from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Globe
} from 'lucide-react';

import {
  getUser
} from '@/app/auth/actions';

export default function Page() {
  const user = getUser();

  // Kind of middleware not really.
  if(!user || !user.is_staff) {
    window.location.assign('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" /> 
    <SidebarInset className="flex flex-col flex-1 min-w-0"> 
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Articles</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button asChild>
            <a href="/">
              <Globe />
              Go to site
            </a>
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
