"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { MasonryImage } from "./_components/masonry-image";
import { Search, Filter, CirclePlus, Check } from "lucide-react";
import { InputStyles } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const filterTags = ["Shirt", "Jeans", "Shorts", "Pants"]

// Masonry layout from https://www.youtube.com/watch?v=rFsEMGxvZNo
export default function Wardrobe() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchFilters, setSearchFilters] = useState<string[]>([])

  const handleFilterChange = (tag: string) => {
    setSearchFilters(prevFilters =>
      prevFilters.includes(tag)
        ? prevFilters.filter(t => t !== tag)
        : [...prevFilters, tag]
    );
  };

  return (
    <div className="min-h-screen w-full p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">My Wardrobe</h1>

      {/* Search Bar */}
      <div className={`${InputStyles} flex items-center max-w-md gap-4 my-3`}>
        <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target?.value)} placeholder="Search for items in your wardrobe" className="w-full focus:outline-none" />
        <Popover>
          <PopoverTrigger>
            <Filter className="size-4" />
          </PopoverTrigger>
          <PopoverContent className="translate-y-[-10px] translate-x-[15px] p-0" side="right" align="start">
            <Command>
              <CommandInput placeholder="Search tags..."/>
              <CommandList>
                <CommandGroup>
                  {filterTags.map((tag) => <CommandItem key={tag} onSelect={() => handleFilterChange(tag)}>
                    <div className="flex justify-between items-center w-full">
                      <span>{tag}</span>
                      <Check className={`size-4 ${searchFilters.includes(tag) ? "opacity-100" : "opacity-0"}`} />
                    </div>
                  </CommandItem>)}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        <MasonryImage props={{ src: `https://picsum.photos/300/500`, alt: "", width: 200, height: 300, className: "w-full max-w-xs object-cover rounded-lg" }} />
        <MasonryImage props={{ src: `https://picsum.photos/500/100`, alt: "", width: 200, height: 300, className: "w-full max-w-xs object-cover rounded-lg" }} />
        <MasonryImage props={{ src: `https://picsum.photos/500/100`, alt: "", width: 200, height: 300, className: "w-full max-w-xs object-cover rounded-lg" }} />
        <MasonryImage props={{ src: `https://picsum.photos/300/500`, alt: "", width: 200, height: 300, className: "w-full max-w-xs object-cover rounded-lg" }} />
        <MasonryImage props={{ src: `https://picsum.photos/300/500`, alt: "", width: 200, height: 300, className: "w-full max-w-xs object-cover rounded-lg" }} />
        <MasonryImage props={{ src: `https://picsum.photos/400/100`, alt: "", width: 200, height: 300, className: "w-full max-w-xs object-cover rounded-lg" }} />

        <button onClick={() => console.log("Clicked!")} className="flex items-center justify-center border-2 border-slate-300 opacity-60 hover:opacity-100 border-dashed rounded-lg w-full max-w-xs h-60 p-4 transition-all hover:cursor-pointer">
          <CirclePlus className="size-8 stroke-slate-300 stroke-1" />
        </button>
      </div>
    </div>
  )
}