"use client"
import { Calendar, Cog, Home, Inbox, LogOut, Search, Settings, Users, Zap } from "lucide-react"

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
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {options.map((item) => {
                const isSelected = path?.includes(item.link);
                return (
                  <SidebarMenuItem key={item.title} className={isSelected ? "border-l-2 border-[#002956] bg-[#F4F4F5]" : ""}>
                    <SidebarMenuButton asChild>
                      <a href={item.link} className={isSelected ? "text-[18px] text-[#002856]" : "text-gray-500"}>
                        <div className="flex flex-col items-center">
                          {<item.icon className={isSelected ? "text-[#002856]" : "text-gray-500"} />}
                          <div>{item.title}</div>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className={path?.includes("/settings") ? "border-l-2 border-[#002956] bg-[#F4F4F5]" : ""}>
            <SidebarMenuButton asChild>
              <a href="/settings" className={path?.includes("/settings") ? "text-[18px] text-[#002856]" : "text-gray-500"}>
                <div className="flex flex-col items-center">
                  <Settings className={path?.includes("/settings") ? "text-[#002856]" : "text-gray-500"} />
                  <div>Settings</div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenuButton onClick={onLogout}>
          <a href="#">
            <div className="flex flex-col items-center">
              <LogOut />
              Log Out
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
