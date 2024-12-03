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
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);
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

  useEffect(() => {
    if (swarmDownloadData?.results) {
      setResults(transformData(swarmDownloadData?.results));
    }
  }, [swarmDownloadData]);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center space-x-2 relative">
          {/* <FileText className="h-5 w-5" />
          <span>Search</span> */}

          <Search className="absolute left-4 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-4"
          />
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

