"use client"

import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

import { MasonryImage } from "../../components/common/masonry-image";
import { AddImageButton } from "./_components/add-image-button";


export default function Wardrobe() {
  const { user } = useUser();
  const clothes = useQuery(api.wardrobe.get.getWardrobeByUserId, { userId: user?.id || "skip"});
  const deleteClothing = useMutation(api.wardrobe.delete.deleteClothing);

  return (
    <div className="min-h-screen w-full p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 pt-2">
        My Wardrobe
      </h1>
      
      {/* Masonry Layout */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
        {clothes?.map((clothing) => (
          <MasonryImage key={clothing._id} _id={clothing._id} src={clothing.url} alt={clothing.name || "clothing"} onDelete={() => deleteClothing({ _id: clothing._id })}/>
        ))}
        <AddImageButton />
      </div>

    </div>
  );
}