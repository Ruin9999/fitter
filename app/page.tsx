"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, LoaderPinwheel, Shirt } from "lucide-react";
import { ColorfulBadge } from "@/components/common/colorful-badge";

export default function Main() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();
  
  function handleSubmit() {
    setIsSubmitted(!isSubmitted);
    console.log(`Submitted: ${text}`);  
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex flex-grow flex-col items-center justify-center p-24">
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            {/* Gradient border container */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-90 transition animate-rainbowWave"></div>

            <div className="relative bg-white dark-bg-gray-800 rounded-lg leading-none flex items-top justify-start space-x-6">
              <Textarea
                className="w-full h-40 p-4 bg-transparent border-none focus:ring-0 focus:output-none resize-none"
                placeholder="How we feelin' today? 🎉"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <div className="flex absolute bottom-2 right-2">
                <Button size="icon" variant="link" onClick={handleSubmit}>
                  <Plus />
                </Button>
                <Button size="icon" variant="link" onClick={() => router.push("/wardrobe")}>
                  <Shirt />
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitted}>
                  {isSubmitted ? <LoaderPinwheel className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full max-w-md flex gap-2 flex-wrap">
            {tags.map((tag) => <ColorfulBadge key={tag} text={tag} onClick={() => setSelectedTags([...selectedTags, tag])} />)}
          </div>
        </div>
      </main>
    </div>
  )
}