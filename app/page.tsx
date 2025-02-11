"use client"

import axios from "axios";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import React, { useState, useRef } from "react";
import { useAction, useMutation, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, LoaderPinwheel, Shirt, PlusCircle, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogContent } from "@/components/ui/dialog";

export default function Main() {
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const { user } = useUser();
  const createChat = useAction(api.chats.post.createChat);
  const createPose = useMutation(api.poses.post.createPose);
  const getUploadUrl = useMutation(api.storage.post.generateUploadUrl);
  const currentPose = useQuery(api.poses.get.getPoseByUserId, { userId: user?.id || "" });

  async function handleSubmit() {
    if (!text) return;
    setIsSubmitted(!isSubmitted);
    const chatId = await createChat({ userId: user?.id || " ", prompt: text, numberOfOutfits: 5 });
    setIsSubmitted(!isSubmitted);
    router.push(`/chat/${chatId}`);
  }

  async function handleEditPose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const uploadUrl = await getUploadUrl();
    if(!file) return;

    axios.post(uploadUrl, file, {
      headers: { 'Content-Type': file.type }
    }).then(async (res) => {
      const { storageId } = await res.data;
      await createPose({ userId: user?.id || " ", storageId });
    }).catch((e) => console.error(e));
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg mx-auto">
        {/* Rainbow Background */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-90 transition animate-rainbowWave"></div>
        
        <div className="relative bg-white dark-bg-gray-800 rounded-lg leading-none flex">
          <Textarea
            className="w-full h-28 bg-transparent border-none focus:ring-0 focus:output-none resize-none"
            placeholder="How we feelin' today? 🎉"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="absolute flex bottom-2 right-2">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleEditPose}/>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="link" onClick={() => router.push("/wardrobe")}>
                  <Shirt />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Wardrobe</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="link" className="hover:no-underline">
                      <p className="text-lg">🕺</p>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="">
                    <DialogHeader>
                      <DialogTitle>Add a pose</DialogTitle>
                      <DialogDescription>This dialog is where you add a pose that will be used for image generation later.</DialogDescription>
                    </DialogHeader>
                    {currentPose ? 
                      <PoseImage 
                        src={currentPose.url} 
                        alt="Current Pose" 
                        onClick={() => inputRef.current?.click()}
                        /> :
                      <AddPoseButton
                        className="w-full h-[200px]"
                        onClick={() => inputRef.current?.click()}
                      />}
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                Edit Pose
              </TooltipContent>
            </Tooltip>
            <Button onClick={handleSubmit} disabled={isSubmitted}>
              {isSubmitted ? <LoaderPinwheel className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

function AddPoseButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <div className={cn(className, "border border-dashed rounded-lg flex items-center justify-center hover:bg-border/10 hover:cursor-pointer transition-all")} onClick={onClick}>
      <PlusCircle className="size-8 stroke-border" />
    </div>
  )
}

function PoseImage({ src, alt, onClick }: { src: string; alt: string, onClick?: () => void }) {
  return (
    <div className="relative w-full max-h-[500px]">
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />
      <Button variant="default" size="icon" className="absolute top-2 right-2" onClick={onClick}>
        <Pencil />
      </Button>
    </div>
  )
}