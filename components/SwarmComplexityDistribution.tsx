"use client"

import { useMemo } from "react"

export default function VerticalBarChart({ graphComplexity }) {
  const data = useMemo(() => {
    const graph_complexity_distribution = graphComplexity?.graph_complexity_distribution || {};
    return Object.keys(graph_complexity_distribution || {})?.map(item => ({
      category: item,
      value: graph_complexity_distribution[item],
    }))
  }, [graphComplexity]);

  // Calculate total for percentages
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex flex-col h-full">
      {data.map((item, index) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        return (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium capitalize text-gray-600">
                {item.category.toLowerCase()}
              </span>
              <span className="text-sm font-medium text-[#002856]">
                {item.value}
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full bar-progress"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: getColorForCategory(item.category)
                }}
              />
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getColorForCategory(item.category) }}
            />
            <span className="text-xs text-[#002856] capitalize">
              {item.category.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get colors for different categories
function getColorForCategory(category: string) {
  const colors = {
    SIMPLE: '#002856', // Primary blue
    MODERATE: '#0071B2', // Secondary blue
    COMPLEX: '#00A3E0', // Lighter blue
  };
  return colors[category.toUpperCase()] || '#002856'; // default to primary blue
}