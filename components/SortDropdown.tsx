'use client'

import { useState } from 'react'
import { Check, ArrowUpDown, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const sortOptions = [
  { label: 'Last Updated', value: 'updated_at' },
  { label: 'Date Created', value: 'created_at' },
  { label: 'Name', value: 'name' },
]

export default function SortDropdown({ onSortChange }: { onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void }) {
  const [sortBy, setSortBy] = useState('updated_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    onSortChange(newSortBy, sortOrder)
  }

  const handleOrderChange = (newOrder: 'asc' | 'desc') => {
    setSortOrder(newOrder)
    onSortChange(sortBy, newOrder)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 px-4 border border-gray-200 hover:bg-gray-50">
          <ArrowUpDown className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {sortOptions.find(option => option.value === sortBy)?.label}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2 text-xs font-semibold text-gray-500">Sort by</div>
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="flex items-center justify-between px-3 py-2 cursor-pointer"
            onClick={() => handleSortChange(option.value)}
          >
            <span className="text-sm text-gray-700">{option.label}</span>
            {sortBy === option.value && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-2 text-xs font-semibold text-gray-500">Order</div>
        <DropdownMenuItem
          className="flex items-center justify-between px-3 py-2 cursor-pointer"
          onClick={() => handleOrderChange('asc')}
        >
          <div className="flex items-center">
            <ArrowUp className="mr-2 h-4 w-4" />
            <span className="text-sm text-gray-700">Ascending</span>
          </div>
          {sortOrder === 'asc' && <Check className="h-4 w-4 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between px-3 py-2 cursor-pointer"
          onClick={() => handleOrderChange('desc')}
        >
          <div className="flex items-center">
            <ArrowDown className="mr-2 h-4 w-4" />
            <span className="text-sm text-gray-700">Descending</span>
          </div>
          {sortOrder === 'desc' && <Check className="h-4 w-4 text-blue-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}