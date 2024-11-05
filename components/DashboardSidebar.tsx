import { Calendar, Cog, Home, Inbox, Search, Settings, Users, Zap } from "lucide-react"

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

// Menu items.

const options = [
  {
    title: "Routine",
    description:
      "Design automated workflows and processes for your AI agents.",
    icon: <Cog className="!h-[24px] !w-[24px] text-[#002856]" />,
    link: "/routines",
  },
  {
    title: "Agent",
    description:
      "Build specialized AI agents tailored to your specific needs.",
    icon: <Users className="!h-[24px] !w-[24px] text-[#002856]" />,
    link: "/agents",
  },
  {
    title: "Swarm",
    description:
      "Orchestrate multiple AI agents to work together on complex tasks.",
    icon: <Zap className="!h-[24px] !w-[24px] text-[#002856]" />,
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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {options.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.link} className="text-[18px]">
                      <div className="flex flex-col items-center">
                        {item.icon}
                        <div>{item.title}</div>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
