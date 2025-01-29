"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface BadgeProps {
  text: string;
  selectedColor?: string;
  defaultColor?: string;
  onClick?: () => void;
}

export function ColorfulBadge({
  text,
  selectedColor,
  defaultColor,
  onClick,
}: BadgeProps) {
  const [isSelected, setIsSelected] = useState(false);

  function handleClick() {
    if (onClick) onClick();
    setIsSelected(!isSelected);
  }

  return (
    <Badge
      variant="outline"
      onClick={handleClick}
      className={`
                transition-all duration-300 ease-in-out font-semibold
                hover:cursor-pointer hover:opacity-70
                ${isSelected ? selectedColor : defaultColor}
            `}
    >
      {text}
    </Badge>
  );
}
