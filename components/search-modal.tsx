"use client";
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Search, User, Zap, Cog } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce';
import { capitalizeFirstChar, useFetchData } from '@/lib/utils';
import { DialogClose } from '@radix-ui/react-dialog';

const links = [
  { id: '1', title: 'Home' },
  { id: '2', title: 'Documentation' },
  { id: '3', title: 'Components' },
  { id: '4', title: 'Blocks' },
  { id: '5', title: 'Charts' },
  { id: '6', title: 'Themes' },
]

const getItemIcon = (item) => {
  const iconMapping = {
    routine: <Cog className="mr-2 h-4 w-4" />,
    agent: <User className="mr-2 h-4 w-4" />,
    swarm: <Zap className="mr-2 h-4 w-4" />,
  }
  return iconMapping[item];
}

export function SearchModal() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

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

  useEffect(() => {
    if (swarmDownloadData?.results) {
      setResults(transformData(swarmDownloadData?.results));
    }
  }, [swarmDownloadData]);

  function transformData(data) {
    const groupedData = {};

    data?.forEach(item => {
      if (!groupedData[item.type]) {
        groupedData[item.type] = {
          type: item.type,
          items: []
        };
      }
      groupedData[item.type].items.push(item);
    });
    return Object.values(groupedData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center w-[400px] h-10 rounded-lg border shadow-sm bg-white">
          <Search className="ml-3 h-4 w-4 text-muted-foreground shrink-0" />
          <input
            className="flex-1 px-3 py-2 text-sm bg-transparent border-0 outline-none placeholder:text-muted-foreground"
            placeholder="Search or ask..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            readOnly
          />
          <kbd className="mr-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className='font-semibold'>
          Search from Routines, Agents and Swarms.
        </DialogHeader>
        <Command>
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />
          {debouncedQuery?.length > 0 &&
            !swarmDownloadData?.results?.length &&
            (
              <div className="mt-1 rounded-md bg-popover shadow-md">
                <CommandList>
                  <CommandEmpty>{isLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>
                </CommandList>
              </div>
            )}
          {results?.length > 0 && results?.map(categoryItem => (
            <CommandList key={categoryItem?.id}>
              <CommandGroup heading={capitalizeFirstChar(categoryItem?.type)} >
                {categoryItem?.items.map((link) => (
                  <a href={`/${link.type}s/${link.id}`} key={link.id}>
                    <CommandItem className='cursor-pointer' >
                      {getItemIcon(categoryItem?.type)}
                      <span>{link.title}</span>
                    </CommandItem>
                  </a>
                ))}
              </CommandGroup>
            </CommandList>
          ))}
        </Command>
      </DialogContent>
    </Dialog>
  )
}
