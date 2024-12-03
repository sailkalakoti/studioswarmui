"use client"

import React from "react"
import { Sparkles } from 'lucide-react'
import { motion } from "framer-motion"

export function AnimatedSparkles({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.5 }}
      animate={{ 
        opacity: [0.5, 1, 0.5], 
        scale: [0.5, 1.2, 0.5],
        rotate: [0, 360]
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className={className}
    >
      <Sparkles className="h-full w-full" />
    </motion.div>
  )
}
