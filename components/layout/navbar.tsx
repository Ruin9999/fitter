"use client"

import Link from "next/link";
import { redirect } from "next/navigation";
import { useUser, SignedIn, SignedOut, SignInButton, useClerk} from "@clerk/nextjs";

import { RainbowButton } from "../common/rainbow-button";
import { Button } from "@/components/ui/button";
import { User, Bookmark, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export default function Navbar() {

  const user = useUser();
  const clerk = useClerk();

  return (
    <nav className="flex items-center justify-between py-3 px-6 bg-white dark:bg-gray-800 shadow-md">
      <Link href="/" className="text-3xl font-pacifico translate-y-[-2px]">fitter</Link>

      <SignedOut>
        <RainbowButton onClick={() => clerk.redirectToSignIn()}>Get started</RainbowButton>
      </SignedOut>

      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user.user?.imageUrl} />
              <AvatarFallback>{user.user?.username?.[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] translate-x-[-10px] translate-y-[5px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href='/profile'>My Profile</Link>
                <DropdownMenuShortcut>
                  <User className="size-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/profile'>Saved Outfits</Link>
                <DropdownMenuShortcut>
                  <Bookmark className="size-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/profile'>Settings</Link>
                <DropdownMenuShortcut>
                  <Settings className="size-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-red-500 focus:text-red-500 ">
                <button onAbort={() => clerk.signOut()}>Sign Out</button>
                <DropdownMenuShortcut className="opacity-100">
                  <LogOut className="size-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </nav>
  )
}
