"use client"

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { SearchBar } from "./_components/search-bar";
import { MasonryImage } from "./_components/masonry-image";
import { AddImageButton } from "./_components/add-image-button";

const filterTags = ["Shirt", "Jeans", "Shorts", "Pants"];

// TODO: Update naming to change "images" to "clothes" in codebase
export default function Wardrobe() {
  const { user } = useUser();
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchFilters, setSearchFilters] = useState<string[]>([]);
  const clothes = useQuery(api.wardrobe.get.getWardrobeByUserId, { userId: user?.id || "skip"});
  
  const handleFilterChange = (tag: string) => {
    setSearchFilters(prevFilters =>
      prevFilters.includes(tag)
        ? prevFilters.filter(t => t !== tag)
        : [...prevFilters, tag]
    );
  };

  return (
    <div className="min-h-screen w-full p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">
        My Wardrobe
      </h1>

      <SearchBar
        searchValue={searchValue}
        searchFilters={searchFilters}
        filterTags={filterTags}
        onSearchChange={setSearchValue}
        onFilterChange={handleFilterChange}
      />
      
      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {clothes?.map((clothing) => (
          <MasonryImage key={clothing._id} _id={clothing._id} src={clothing.url} alt={clothing.name} />
        ))}
        <AddImageButton />
      </div>

    </div>
  );
}