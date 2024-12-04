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
import { Cog, Users, Zap, BarChart, Clock, Cpu, Table, Webhook, ChevronDown, Code, Play, Save, Settings, Brain, Target, Network, GitBranch, Workflow } from "lucide-react";
import axiosInstance from "@/lib/apiService";
import AverageRoutineChart from "./AverageRoutineChart";
import VerticalBarChart from "./SwarmComplexityDistribution";
import { useFetchData } from "@/lib/utils";
import constants from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as React from "react";

const getData = async (url) => {
  const { data } = await axiosInstance.get(url);
  return data;
}
export function Dashboard() {
  const { FORM_VALIDATION_MESSAGES, PAGE_SUBTITLES } = constants;
  const options = [
    {
      step: 1,
      title: "Create Routine",
      description: "Start by creating a routine - your basic building block for automation",
      icon: <Cog className="!h-[24px] !w-[24px] text-[#002856]" />,
      link: "/routines/create",
    },
    {
      step: 2,
      title: "Create Agent",
      description: "Define an agent to execute your routines intelligently",
      icon: <Users className="!h-[24px] !w-[24px] text-[#002856]" />,
      link: "/agents/create",
    },
    {
      step: 3,
      title: "Create Swarm",
      description: "Combine agents into a swarm for complex automation workflows",
      icon: <Zap className="!h-[24px] !w-[24px] text-[#002856]" />,
      link: "/swarms/create",
    },
  ];

  const headerOptions  = [
    {
      title: "Total Routines",
      icon: <Cog className="!h-[24px] !w-[24px] text-[#002856]" />,
      id: 'routines',
    },
    {
      title: "Total Agents",
      icon: <Users className="!h-[24px] !w-[24px] text-[#002856]" />,
      id: 'agents',
    },
    {
      title: "Total Swarms",
      icon: <Zap className="!h-[24px] !w-[24px] text-[#002856]" />,
      id: 'swarms',
    },
  ];

  // const { data: graphComplexity } = useQuery('graphComplexityDistribution', () => getData('/metrics/graph-complexity-distribution'));
  const { data: graphComplexity } = useFetchData('/metrics/graph-complexity-distribution');
  const { data: averageRoutinePerAgent } = useFetchData('/metrics/average-routines-per-agent');
  const { data: counts } = useFetchData('/metrics/counts');

  // Learning/Explore section data
  const exploreItems = [
    {
      number: "1",
      title: "Make terminology",
      description: "Get familiar with basic terms",
    },
    {
      number: "2", 
      title: "Understanding operations",
      description: "Learn how to count operations",
    },
    {
      number: "3",
      title: "Scheduling",
      description: "How to schedule your scenarios",
    },
    {
      number: "4",
      title: "Filtering data",
      description: "Filter data in your workflows", 
    },
    {
      number: "5",
      title: "Routers",
      description: "How to build multiple branches",
    },
    {
      number: "6",
      title: "Iterator & Aggregator",
      description: "Combine and separate bundles",
    }
  ];

  // Template section data
  const templates = [
    {
      title: "Create new completions with ChatGPT",
      description: "from new rows in Google Sheets",
      icons: [<Cpu key="1" className="h-6 w-6" />, <Table key="2" className="h-6 w-6" />]
    },
    {
      title: "Add data to a Google Sheet",
      description: "received from a Webhook",
      icons: [<Webhook key="1" className="h-6 w-6" />, <Table key="2" className="h-6 w-6" />]
    },
    // Add more templates as needed
  ];

  // Update the explore links data with Swarm examples and docs
  const exploreLinks = [
    {
      title: "Swarm Framework",
      description: "Educational framework exploring ergonomic, lightweight multi-agent orchestration",
      link: "https://github.com/openai/swarm"
    },
    {
      title: "Orchestrating Agents",
      description: "Learn about routines and handoffs patterns in the OpenAI Cookbook",
      link: "https://cookbook.openai.com/examples/orchestrating_agents"
    },
    {
      title: "Triage Agent Example",
      description: "Learn how to build a triage agent that routes requests to specialized agents",
      link: "https://github.com/openai/swarm/tree/main/examples/triage_agent"
    },
    {
      title: "Airline Service Example",
      description: "Multi-agent setup for handling different customer service requests",
      link: "https://github.com/openai/swarm/tree/main/examples/airline"
    },
    {
      title: "Weather Agent Example",
      description: "Simple example demonstrating function calling with a single agent",
      link: "https://github.com/openai/swarm/tree/main/examples/weather_agent"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 flex">
        <main className="container mx-auto px-4 py-8">
          <Accordion 
            type="multiple" 
            defaultValue={["dashboard", "create", "explore"]} 
            className="w-full space-y-5"
          >
            {/* Dashboard Section */}
            <AccordionItem value="dashboard" className="border-none bg-white rounded-lg shadow">
              <AccordionTrigger className="hover:no-underline flex items-center gap-2 px-6">
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                {/* Stats Cards - simplified design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {headerOptions.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">{item.title}</h3>
                        <p className="text-2xl font-bold text-[#002856] mt-1">{counts?.[item.id]}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {item.icon}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts - improved layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Swarm Complexity Distribution</h3>
                    <div className="h-[200px]">
                      <VerticalBarChart graphComplexity={graphComplexity} />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Average Routines per Agent</h3>
                    <div className="h-[200px]">
                      <AverageRoutineChart averageRoutinePerAgent={averageRoutinePerAgent} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Create New Section - also update this for consistency */}
            <AccordionItem value="create" className="border-none bg-white rounded-lg shadow">
              <AccordionTrigger className="hover:no-underline flex items-center gap-2 px-6">
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                <h2 className="text-xl font-bold text-gray-900">Start Building</h2>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <div className="flex flex-col space-y-4">
                  {/* Step 1: Create Routine */}
                  <Link href="/routines/create">
                    <div className="bg-white rounded-lg p-6 relative hover:-translate-y-0.5 hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer">
                      <div className="flex items-start gap-8">
                        {/* Left: Icon & Title */}
                        <div className="flex-shrink-0 w-72">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-[#002856]/5">
                              <Cog className="!h-[24px] !w-[24px] text-[#002856]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#002856]">Create Routine</h3>
                              <span className="text-sm text-gray-500">Step 1</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle: Description & Features */}
                        <div className="flex-grow">
                          <p className="text-gray-600 mb-4">Start by creating a routine - your basic building block for automation</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <Code className="w-4 h-4" /> Write or generate code
                            </span>
                            <span className="flex items-center gap-2">
                              <Play className="w-4 h-4" /> Test execution
                            </span>
                            <span className="flex items-center gap-2">
                              <Save className="w-4 h-4" /> Save & reuse
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Step 2: Create Agent */}
                  <Link href="/agents/create">
                    <div className="bg-white rounded-lg p-6 relative hover:-translate-y-0.5 hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer">
                      <div className="absolute left-12 -top-4 w-0.5 h-4 bg-gray-200" />
                      <div className="flex items-start gap-8">
                        <div className="flex-shrink-0 w-72">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-[#002856]/5">
                              <Users className="!h-[24px] !w-[24px] text-[#002856]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#002856]">Create Agent</h3>
                              <span className="text-sm text-gray-500">Step 2</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-600 mb-4">Define an agent to execute your routines intelligently</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <Settings className="w-4 h-4" /> Configure behavior
                            </span>
                            <span className="flex items-center gap-2">
                              <Brain className="w-4 h-4" /> Set intelligence
                            </span>
                            <span className="flex items-center gap-2">
                              <Target className="w-4 h-4" /> Define goals
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Step 3: Create Swarm */}
                  <Link href="/swarms/create">
                    <div className="bg-white rounded-lg p-6 relative hover:-translate-y-0.5 hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer">
                      <div className="absolute left-12 -top-4 w-0.5 h-4 bg-gray-200" />
                      <div className="flex items-start gap-8">
                        <div className="flex-shrink-0 w-72">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-[#002856]/5">
                              <Zap className="!h-[24px] !w-[24px] text-[#002856]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#002856]">Create Swarm</h3>
                              <span className="text-sm text-gray-500">Step 3</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-600 mb-4">Combine agents into a swarm for complex automation workflows</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <Network className="w-4 h-4" /> Connect agents
                            </span>
                            <span className="flex items-center gap-2">
                              <GitBranch className="w-4 h-4" /> Define workflow
                            </span>
                            <span className="flex items-center gap-2">
                              <Workflow className="w-4 h-4" /> Orchestrate tasks
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Explore Section */}
            <AccordionItem value="explore" className="border-none bg-white rounded-lg shadow">
              <AccordionTrigger className="hover:no-underline flex items-center gap-2 px-6">
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                <h2 className="text-xl font-bold text-gray-900">Explore</h2>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                {/* First row - Main framework links */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exploreLinks.slice(0, 2).map((item, index) => (
                      <Link 
                        href={item.link} 
                        key={index}
                        className="group p-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="space-y-1">
                          <h3 className="text-[#002856] font-medium group-hover:text-[#0071B2] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Second row - Example links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {exploreLinks.slice(2).map((item, index) => (
                    <Link 
                      href={item.link} 
                      key={index}
                      className="group p-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="space-y-1">
                        <h3 className="text-[#002856] font-medium group-hover:text-[#0071B2] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </main>
      </div>
    </div>
  );
}
