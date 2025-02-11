"use client"
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { Skeleton } from "@/components/ui/skeleton";
import { MasonryImage } from "@/components/common/masonry-image";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function Chat({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const chat = useQuery(api.chats.get.getChatById, { chatId: id })
  const outfits = useQuery(api.outfits.get.getOutfitsByChatId, { chatId: id })

  return (
    <div className="relative w-full flex flex-col px-4">
      <div className="text-3xl font-extrabold tracking-tight py-8">
        {chat ? chat.title : <Skeleton className="w-1/2 h-8" />}
        {chat && <small className="text-xs font-light pl-4 text-muted-foreground">{new Date(chat?._creationTime || 0).toLocaleDateString()}</small>}
      </div>
      <div className="w-full columns-2">
        {!outfits && <Skeleton className="w-full h-96" />}
        {outfits?.map(outfit => <ImageComponent key={outfit._id} _id={outfit._id} outfit={outfit} />)}
      </div>
    </div>
  )
}

function ImageComponent({ _id, outfit }: { _id: string, outfit: Doc<"outfits"> }) {
  return <Dialog>
    <DialogTrigger>
      <MasonryImage key={_id} _id={_id} alt={outfit.description || ""} src={outfit.url} />
    </DialogTrigger>
    <DialogContent>
      <DialogTitle className="sr-only">Image dialog popup</DialogTitle>
        <img src={outfit.url} alt={outfit.description} />
        <Card>
          <CardContent className='p-4'>
            <p className="font-bold">Recommendation:</p>
            {outfit.recommendations}
          </CardContent>
        </Card>
    </DialogContent>
  </Dialog>
}