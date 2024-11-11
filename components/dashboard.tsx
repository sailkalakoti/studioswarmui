"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cog, Users, Zap, BarChart, Clock, Cpu } from "lucide-react";
import axiosInstance from "@/lib/apiService";
import { useQuery } from "react-query";

const getData = async (url) => {
  const { data } = await axiosInstance.get(url);
  return data;
}
export function Dashboard() {
  const summaryData = [
    {
      title: "Active Agents",
      value: "24",
      icon: <Users className="h-8 w-8 text-[#002856]" />,
    },
    {
      title: "Completed Tasks",
      value: "1,284",
      icon: <Clock className="h-8 w-8 text-[#002856]" />,
    },
    {
      title: "CPU Usage",
      value: "67%",
      icon: <Cpu className="h-8 w-8 text-[#002856]" />,
    },
  ];

  const options = [
    {
      title: "Create Routine",
      description:
        "Design automated workflows and processes for your AI agents.",
      icon: <Cog className="h-12 w-12 text-[#002856]" />,
      link: "/routines/create",
    },
    {
      title: "Create Agent",
      description:
        "Build specialized AI agents tailored to your specific needs.",
      icon: <Users className="h-12 w-12 text-[#002856]" />,
      link: "/agents/create",
    },
    {
      title: "Create Swarm",
      description:
        "Orchestrate multiple AI agents to work together on complex tasks.",
      icon: <Zap className="h-12 w-12 text-[#002856]" />,
      link: "/swarms/create",
    },
  ];

  const { data: graphComplexity } = useQuery('graphComplexityDistribution', () => getData('/metrics/graph-complexity-distribution'));
  const { data: averageRoutinePerAgent } = useQuery('averageRoutinePerAgent', () => getData('/metrics/average-routines-per-agent'));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <div className="flex-1 flex">
        {/* <SidebarProvider>
          <SidebarTrigger />
          <AppSidebar />
        </SidebarProvider> */}
        {/* <aside className="w-64 bg-white shadow-md">
          <nav className="mt-8">
            <div className="px-4 mb-4">
              <div className="mt-2 ml-4 space-y-2">
                <Link href="/routines" className="flex items-center space-x-2 cursor-pointer">
                  <Route className="h-4 w-4 text-[#002856]" />
                  <span>Routines</span>
                </Link>
                <Link href="/agents" className="flex items-center space-x-2 cursor-pointer">
                  <Bot className="h-4 w-4 text-[#002856]" />
                  <span>Agents</span>
                </Link>
                <Link href="/swarms" className="flex items-center space-x-2 cursor-pointer">
                  <Brain className="h-4 w-4 text-[#002856]" />
                  <span>Swarms</span>
                </Link>
              </div>
            </div>

          </nav>
        </aside> */}
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {summaryData.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  {item.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <BarChart className="h-full w-full text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map((option, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-4">
                    {option.icon}
                    <span>{option.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{option.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                  >
                    <Link href={option.link}>Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
      {/* <footer className="bg-white shadow-sm mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} StudioSwarm. All rights reserved.
          </p>
          <div className="mt-4">
            <Link href="#" className="text-[#ff7070] hover:text-[#ff5555] mx-2">
              Terms of Service
            </Link>
            <Link href="#" className="text-[#ff7070] hover:text-[#ff5555] mx-2">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[#ff7070] hover:text-[#ff5555] mx-2">
              Contact Us
            </Link>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
