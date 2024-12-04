"use client";
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command"
import { Search, User, Zap, Cog, X } from 'lucide-react'
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
            placeholder="Search resources..."
            readOnly
          />
          <kbd className="mr-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-xl overflow-hidden border-none bg-white shadow-lg rounded-xl">
        <div className="flex items-center border-b">
          <Search className="ml-4 h-4 w-4 text-gray-400" />
          <input
            className="flex-1 px-3 h-12 text-base bg-transparent border-0 outline-none placeholder:text-gray-400"
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => setOpen(false)} className="mr-2 hover:bg-gray-100 p-2 rounded-lg">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {!debouncedQuery && (
            <div className="py-8 text-center">
              <div className="text-sm text-gray-500 mb-4">Search for routines, agents, or swarms</div>
              <div className="flex flex-wrap justify-center gap-2 px-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-600">
                  <Cog className="h-4 w-4" />
                  <span>Routines</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Agents</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-600">
                  <Zap className="h-4 w-4" />
                  <span>Swarms</span>
                </div>
              </div>
            </div>
          )}

          {debouncedQuery?.length > 0 && !swarmDownloadData?.results?.length && (
            <div className="py-6 text-center text-gray-500 text-sm">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚪</span>
                  Searching...
                </div>
              ) : (
                'No results found.'
              )}
            </div>
          )}
          
          {results?.length > 0 && results?.map(categoryItem => (
            <div key={categoryItem?.id}>
              <div className="px-4 py-2 text-sm text-gray-500">
                {capitalizeFirstChar(categoryItem?.type)}
              </div>
              {categoryItem?.items.map((link) => (
                <a 
                  href={`/${link.type}s/${link.id}`} 
                  key={link.id}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {getItemIcon(categoryItem?.type)}
                  <span>{link.title}</span>
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="p-4 text-xs text-gray-500 border-t">
          Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-50 rounded border">ESC</kbd> to close
        </div>
      </DialogContent>
    </Dialog>
  )
}
