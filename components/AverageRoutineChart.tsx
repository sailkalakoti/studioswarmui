"use client"

import { useMemo } from "react"
import { ChartContainer } from "@/components/ui/chart"

export default function AverageRoutineChart({ averageRoutinePerAgent }) {
  const average = averageRoutinePerAgent?.average_routines_per_agent || 0;
  const maxValue = 10;
  const percentage = (average / maxValue) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-100"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="64"
            cy="64"
          />
          <circle
            className="text-[#002856]"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="64"
            cy="64"
            strokeDasharray={`${percentage * 3.51} 351`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-[#002856]">{average}</span>
          <span className="text-sm text-gray-600">routines</span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">per agent</div>
      </div>
    </div>
  )
}