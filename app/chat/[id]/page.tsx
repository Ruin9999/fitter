"use client"
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Chat({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const chat = useQuery(api.chats.get.getChatById, { chatId: id })

  return (
    <div className="flex w-full bg-red-100">
      <div className="flex-1 overflow-y-auto">
        <h1>Chat {id}</h1> 
        <p>Testing cat</p>
      </div>
    </div>
  )
}