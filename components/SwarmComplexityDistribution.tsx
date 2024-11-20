"use client"

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ChartContainer } from "./ui/chart"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useMemo } from "react"

// Sample data for the chart
// const data = [
//   { category: "A", value: 400 },
//   { category: "B", value: 300 },
//   { category: "C", value: 500 },
//   { category: "D", value: 280 },
//   { category: "E", value: 590 },
// ]

export default function VerticalBarChart({ graphComplexity }) {
  const data = useMemo(() => {
    const graph_complexity_distribution = graphComplexity?.graph_complexity_distribution || {};
    return Object.keys(graph_complexity_distribution || {})?.map(item => ({
      category: item,
      value: graph_complexity_distribution[item],
    }))
  }, [graphComplexity]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Swarm Complexity Distributions</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-fit">
          <ResponsiveContainer width="100%" aspect={16/9} >
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="category" tickLine={false} />
              <ChartTooltip />
              <Bar dataKey="value" fill="#002856" radius={[4, 4, 0, 0]}  />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}