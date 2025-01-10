"use client"

import { SendHorizontal, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  const [isCanSubmit, setIsCanSubmit] = useState(true);

  function handleSubmit() {
    setIsCanSubmit(false);
    console.log(value);
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <Textarea
          value={value}
          disabled={!isCanSubmit}
          onChange={(e) => setValue(e.target.value)}
          className="w-96 h-48 resize-none"
          placeholder="Type something... &#127881;"
        />
        <Button
          className="absolute bottom-2 right-2"
          disabled={!isCanSubmit}
          onClick={handleSubmit}
        >
          {isCanSubmit ? <SendHorizontal className="size-4"/> : <Loader className="size-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}