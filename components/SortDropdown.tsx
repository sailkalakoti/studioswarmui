'use client'

import { useState } from 'react'
import { Check, ChevronDown, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Created Date', value: 'created_at' },
  { label: 'Updated Date', value: 'updated_at' },
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
      <div className='flex items-center'>
        <ArrowUpDown className="mr-2 h-4 w-4" />
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            <span>{sortOptions.find(option => option.value === sortBy)?.label}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-[200px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => handleSortChange(option.value)}>
            <Check className={`mr-2 h-4 w-4 ${sortBy === option.value ? 'opacity-100' : 'opacity-0'}`} />
            {option.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}