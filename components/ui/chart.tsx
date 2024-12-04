"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChartContainer({ className, ...props }: ChartContainerProps) {
  return (
    <div className={cn("h-[350px] w-full", className)} {...props} />
  )
}
