"use client"
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"

interface MasonryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  _id: Id<"clothes">;
  alt: string;
  className?: string;
}

export function MasonryImage({ className, ...imageProps }: MasonryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const deleteClothing = useMutation(api.wardrobe.delete.deleteClothing);

  return (
    <div className={`relative group mb-4 break-inside-avoid ${className}`}>

      {/* Image Skeleton */}
      {isLoading && <Skeleton className="w-full h-[250px] rounded-lg" />}

      {/* Image Element */}
      <img
        className={`w-full object-cover rounded-lg shadow-lg ${isLoading ? "hidden" : "block"}`}
        onLoad={() => setIsLoading(false)}
        {...imageProps}
      />

      {/* Buttons */}
      <Button variant="destructive" className="absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-all" onClick={() => deleteClothing({ _id: imageProps._id })}>
        <Trash2 />
      </Button>
    </div>
  )
}