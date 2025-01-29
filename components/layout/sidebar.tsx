"use client"

import Link from "next/link";
import { useQuery } from "convex/react";
import { truncateString } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { CircleUserRound, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuShortcut, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

export function CustomSidebar() {
  const user = useUser();
  const clerk = useClerk();
  const chats = useQuery(api.chats.get.get, {});

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="text-3xl text-center py-2 font-pacifico">fitter</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Outfits</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats?.map(({ _id, title}) => {
                return <SidebarMenuItem key={_id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/chat/${_id}`}>{truncateString(title, 35)}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-row gap-2 px-2 pt-2 pb-1">
                <Avatar>
                  <AvatarImage src={user.user?.imageUrl} />
                  <AvatarFallback>{user.user?.username?.[0] || user.user?.fullName}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                  <p className="text-xs">{user.user?.username || user.user?.fullName}</p>
                  <p className="text-xs font-bold">{user.user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" loop>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>
                    <CircleUserRound className="size-4" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>
                    <Settings className="size-4" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => clerk.signOut()}>
                Log out
                <DropdownMenuShortcut>
                  <LogOut className="size-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        <SignedOut>
          <Button onClick={() => clerk.redirectToSignIn()}>Sign in</Button>
        </SignedOut>
      </SidebarFooter>
    </Sidebar>
  )
}