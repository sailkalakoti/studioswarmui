"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AverageRoutineChart({ averageRoutinePerAgent }) {
  const data = [
    { name: "Average", value: averageRoutinePerAgent?.average_routines_per_agent || 0 }
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Average Routines per Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" aspect={16/9} >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" horizontal={false} /> */}
              <XAxis
                type="number"
                domain={[0, 10]}
                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                tickLine={false}
              />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Average Routines']}
                labelFormatter={() => ''}
              />
              <Bar
                dataKey="value"
                fill="#002856"
                barSize={120}
              >
                {data.map((entry, index) => (
                  <text
                    key={`label-${index}`}
                    x={entry.value * 30 + 10}
                    y={20}
                    fill="hsl(var(--foreground))"
                    textAnchor="start"
                    // dominantBaseline="middle"
                  >
                    {entry.value}
                  </text>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}