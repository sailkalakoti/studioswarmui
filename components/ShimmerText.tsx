import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerTextProps {
  text: string;
  className?: string;
}

export function ShimmerText({ text, className }: ShimmerTextProps) {
  return (
    <div className={cn("flex flex-wrap justify-center", className)}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="animate-shimmer text-blue-500"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}