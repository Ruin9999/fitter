import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

export function RainbowButton({className, children, ...props}: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "relative overflow-hidden rounded-md font-semibold",
        "text-white",
        "bg-white/20 backdrop-blur-md",
        "hover:scale-[1.03] hover:shadow-lg transition-transform",
        "before:absolute before:inset-0 before:-z-10 before:bg-[length:400%_400%]",
        "before:bg-[linear-gradient(to_right,_#ef4444,_#a855f7,_#22c55e,_#3b82f6,_#eab308)]",
        "before:animate-rainbowWave",
        className
      )}
    >
      {children}
    </Button>
  )
}