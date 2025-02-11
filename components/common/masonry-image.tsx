"use client";
import { toast } from "sonner";
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MasonryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  _id: string;
  alt: string;
  className?: string;
  onDelete?: () => void;
}

export function MasonryImage({ className, onDelete, ...imageProps }: MasonryImageProps) {
  return (
    <div
      className={`relative group mb-4 break-inside-avoid ${className}`}
    >
      <img
        className={`w-full object-cover`}
        {...imageProps}
      />

      {/* Delete Button */}
      {onDelete && (
        <Button
          variant="destructive"
          className="absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-all"
          onClick={() => {
            toast.error("Image deleted!");
            onDelete?.();
          }}
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
}
