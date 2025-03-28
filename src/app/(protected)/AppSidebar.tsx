"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  useSidebar,
} from "../../components/ui/sidebar";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/logo.png"
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const projects = [
  {
    name: "project 1",
  },
  {
    name: "Project 2",
  },
  {
    name: "Project 3",
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { open} = useSidebar()

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src={logo} alt="logo" width={60} height={60} />
          {open && (
        <h1 className="text-xl font-bold text-primary/80">
        GithubGPT
       </h1>
       )}
        </div>
       
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn({
                          "!bg-primary !text-white": pathname === item.url,
                        })}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div>
                        <div
                          className={cn(
                            "rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary",
                            {
                              "bg-primary text-white": true,
                            }
                          )}
                        >
                          {project.name[0]}
                        </div>
                        <span>{project.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="h-2"></div>
       {open && ( <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/create">
              <Button size="sm" variant={"outline"} className="w-fit">
                <Plus />
                Create Project
              </Button>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>)}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
