"use client"
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { useDebounce } from '@/hooks/useDebounce'

type SearchResult = {
  id: string
  title: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const searchResults = async () => {
      if (debouncedQuery.length >= 4) {
        setIsLoading(true)
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 500))
        // Replace this with your actual search logic
        const mockResults: SearchResult[] = [
          { id: '1', title: 'Result 1' },
          { id: '2', title: 'Result 2' },
          { id: '3', title: 'Result 3' },
        ]
        setResults(mockResults)
        setIsLoading(false)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    }

    searchResults()
  }, [debouncedQuery])

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 pr-4"
        />
      </div>
      {showResults && (
        <div className="absolute mt-1 w-full rounded-md bg-popover shadow-md">
          <Command>
            <CommandList>
              <CommandEmpty>{isLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>
              <CommandGroup heading="Results">
                {results.map((result) => (
                  <CommandItem key={result.id}>
                    <span>{result.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}

