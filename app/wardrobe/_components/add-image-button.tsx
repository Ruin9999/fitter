"use client"

import axios from "axios";
import { toast } from "sonner";
import { useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { CirclePlus } from "lucide-react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AddImageButton() {
  const { user } = useUser();
  const getImageUrl = useMutation(api.storage.post.generateUploadUrl);
  const uploadImage = useAction(api.wardrobe.post.uploadImage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      toast.info("Uploading image...");
      const uploadUrl = await getImageUrl();
      axios.post(uploadUrl, file, {
        headers: { 'Content-Type': file.type }
      }).then(async (res) => {
        const { storageId } = await res.data
        await uploadImage({ name: file.name, userId: user?.id || "", storageId });
      });

      toast.success("Image uploaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload image.");
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    
    await handleImageUpload(files[0]);
    event.target.value = "";
  };

  // Separate the button styles for better readability
  const buttonClasses = [
    "flex",
    "items-center",
    "justify-center",
    "border-2",
    "border-slate-400",
    "opacity-60",
    "hover:opacity-100",
    "border-dashed",
    "rounded-lg",
    "w-full",
    "max-w-xs",
    "h-60",
    "p-4",
    "transition-all",
    "hover:cursor-pointer"
  ].join(" ");

  return (
    <button 
      onClick={() => inputRef.current?.click()}
      className={buttonClasses}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      <CirclePlus className="size-8 stroke-slate-400 stroke-1" />
    </button>
  );
}