"use client"
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { useDebounce } from '@/hooks/useDebounce'
import { useFetchData } from '@/lib/utils'

type SearchResult = {
  id: string
  title: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 300);
  const { data: swarmDownloadData, isLoading }: {
    data: {
      query: string;
      results: any;
      total_results: number;
    },
    isLoading: boolean;
  } = useFetchData(
    '/search/',
    {
      language: 'english',
      limit: 10,
      q: debouncedQuery,
    }, 'json',
    {
      enabled: debouncedQuery?.length > 0
    },
    [debouncedQuery]
  );

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
      {debouncedQuery?.length > 0 &&
        !swarmDownloadData?.results?.length &&
        (
          <div className="absolute mt-1 w-full rounded-md bg-popover shadow-md">
            <Command>
              <CommandList>
                <CommandEmpty>{isLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>
              </CommandList>
            </Command>
          </div>
        )}
      {swarmDownloadData?.results?.length > 0 && (
        <div className="absolute mt-1 w-full rounded-md bg-popover shadow-md">
          <Command>
            <CommandList>
              <CommandEmpty>{isLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>
              <CommandGroup heading="Results">
                {swarmDownloadData?.results.map((result) => (
                  <a href={`/${result.type}s/${result.id}`} key={result.id}>
                    <CommandItem >
                      <span>{result.title}</span>
                    </CommandItem>
                  </a>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}

