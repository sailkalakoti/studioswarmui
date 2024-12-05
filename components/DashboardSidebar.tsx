"use client"
import { Calendar, Cog, Home, LayoutDashboard, Inbox, LogOut, Search, Settings, Users, Zap } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation";
import { useApiMutation } from "@/lib/utils";

// Menu items.

const options = [
  {
    title: "Home",
    description: "View your analytics and overview.",
    icon: Home,
    link: "/dashboard",
  },
  {
    title: "Routines",
    description:
      "Design automated workflows and processes for your AI agents.",
    // icon: <Cog className="!h-[24px] !w-[24px] text-[#002856]" />,
    icon: Cog,
    link: "/routines",
  },
  {
    title: "Agents",
    description:
      "Build specialized AI agents tailored to your specific needs.",
    // icon: <Users className="!h-[24px] !w-[24px] text-[#002856]" />,
    icon: Users,
    link: "/agents",
  },
  {
    title: "Swarms",
    description:
      "Orchestrate multiple AI agents to work together on complex tasks.",
    // icon: <Zap className="!h-[24px] !w-[24px] text-[#002856]" />,
    icon: Zap,
    link: "/swarms",
  },
];

export function AppSidebar() {

  const router = useRouter();
  const path = usePathname();

  const logoutMutate = useApiMutation("/auth/logout", "POST", {
    onSuccess: () => {
      router.push('/login');
    }
  });

  const onLogout = () => {
    logoutMutate.mutate({});
  }

  return (
    <Sidebar className="pt-[40px] bg-white border-r border-gray-200 flex flex-col h-full">
      <SidebarContent>
        <SidebarGroup className="bg-white">
          <SidebarGroupContent className="bg-white">
            <SidebarMenu className="gap-3">
              {options.map((item) => {
                const isSelected = path?.includes(item.link);
                return (
                  <SidebarMenuItem 
                    key={item.title} 
                    className={`rounded-md border transition-all ${
                      isSelected 
                        ? "border-[#002956]/10 bg-[#F4F4F5]" 
                        : "border-transparent hover:border-gray-100 hover:bg-gray-50/60"
                    }`}
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.link} className={isSelected ? "text-[#002856]" : "text-gray-500"}>
                        <div className="flex flex-col items-center py-1.5">
                          {<item.icon className={`${isSelected ? "text-[#002856]" : "text-gray-500"} h-5 w-5`} />}
                          <div className="text-sm mt-0.5">{item.title}</div>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="flex-1 bg-white" />
      <SidebarFooter className="bg-white">
        <SidebarGroup className="bg-white">
          <SidebarGroupContent className="bg-white">
            <SidebarMenu className="gap-2">
              <SidebarMenuItem 
                className={`rounded-md border transition-all ${
                  path?.includes("/settings")
                    ? "border-[#002956]/10 bg-[#F4F4F5]" 
                    : "border-transparent hover:border-gray-100 hover:bg-gray-50/60"
                }`}
              >
                <SidebarMenuButton asChild>
                  <a href="/settings" className={path?.includes("/settings") ? "text-[#002856]" : "text-gray-500"}>
                    <div className="flex items-center justify-center p-2">
                      <Settings className={path?.includes("/settings") ? "text-[#002856] h-6 w-6" : "text-gray-500 h-6 w-6"} />
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem 
                className="rounded-md border transition-all border-transparent hover:border-gray-100 hover:bg-gray-50/60"
              >
                <SidebarMenuButton asChild>
                  <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="text-gray-500">
                    <div className="flex items-center justify-center p-2">
                      <LogOut className="text-gray-500 h-6 w-6" />
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
