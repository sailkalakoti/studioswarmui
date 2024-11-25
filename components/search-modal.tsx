import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { FileText } from 'lucide-react'

const links = [
  { id: '1', title: 'Home' },
  { id: '2', title: 'Documentation' },
  { id: '3', title: 'Components' },
  { id: '4', title: 'Blocks' },
  { id: '5', title: 'Charts' },
  { id: '6', title: 'Themes' },
]

export function SearchModal() {
  const [query, setQuery] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <Command>
          <Input
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />
          <CommandList>
            <CommandGroup heading="Links">
              {links.map((link) => (
                <CommandItem key={link.id}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{link.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

