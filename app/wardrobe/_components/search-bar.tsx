"use client"

import { InputStyles } from "@/components/ui/input"
import { Filter, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface SearchBarProps {
  searchValue: string;
  searchFilters: string[];
  filterTags: string[];
  onSearchChange: (value: string) => void;
  onFilterChange: (tag: string) => void;
}

export function SearchBar({ searchValue, searchFilters, filterTags, onSearchChange, onFilterChange }: SearchBarProps) {
  return (
    <div className={`${InputStyles} flex items-center max-w-md gap-4 my-3`}>
      <input type="text" value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search for items in your wardrobe" className="w-full focus:outline-none" />
      <Popover>
        <PopoverTrigger>
          <Filter className="size-4" />
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>Tag not found.</CommandEmpty>
              <CommandGroup>
                {filterTags.map((tag) => (
                  <CommandItem key={tag} onSelect={() => onFilterChange(tag)}>
                    <div className="flex justify-between items-center w-full">
                      <span>{tag}</span>
                      <Check className={`size-4 ${searchFilters.includes(tag) ? "opacity-100" : "opacity-0"}`} />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}