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
import AverageRoutineChart from "./AverageRoutineChart";
import VerticalBarChart from "./SwarmComplexityDistribution";
import { useFetchData } from "@/lib/utils";
import constants from "@/constants";

const getData = async (url) => {
  const { data } = await axiosInstance.get(url);
  return data;
}
export function Dashboard() {
  const { FORM_VALIDATION_MESSAGES, PAGE_SUBTITLES } = constants;
  const options = [
    {
      title: "Create Routine",
      description: PAGE_SUBTITLES['routines'],
      icon: <Cog className="h-12 w-12 text-[#002856]" />,
      link: "/routines/create",
    },
    {
      title: "Create Agent",
      description: PAGE_SUBTITLES['agents'],
      icon: <Users className="h-12 w-12 text-[#002856]" />,
      link: "/agents/create",
    },
    {
      title: "Create Swarm",
      description: PAGE_SUBTITLES['swarms'],
      icon: <Zap className="h-12 w-12 text-[#002856]" />,
      link: "/swarms/create",
    },
  ];

  const headerOptions  = [
    {
      title: "Total Routines",
      icon: <Cog className="h-12 w-12 text-[#002856]" />,
      id: 'routines',
    },
    {
      title: "Total Agents",
      icon: <Users className="h-12 w-12 text-[#002856]" />,
      id: 'agents',
    },
    {
      title: "Total Swarms",
      icon: <Zap className="h-12 w-12 text-[#002856]" />,
      id: 'swarms',
    },
  ];

  // const { data: graphComplexity } = useQuery('graphComplexityDistribution', () => getData('/metrics/graph-complexity-distribution'));
  const { data: graphComplexity } = useFetchData('/metrics/graph-complexity-distribution');
  const { data: averageRoutinePerAgent } = useFetchData('/metrics/average-routines-per-agent');
  const { data: counts } = useFetchData('/metrics/counts');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 flex">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {headerOptions.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                    {item.title}
                  </CardTitle>
                  {item.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts?.[item.id]}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <VerticalBarChart graphComplexity={graphComplexity} />
              <AverageRoutineChart averageRoutinePerAgent={averageRoutinePerAgent} />
          </div>
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
    </div>
  );
}
