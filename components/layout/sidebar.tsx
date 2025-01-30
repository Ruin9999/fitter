"use client"

import Link from "next/link";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { truncateString } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, Settings, LogOut , Shirt, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuShortcut } from "@/components/ui/context-menu";
import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuShortcut, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

export function CustomSidebar() {
  const user = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const chats = useQuery(api.chats.get.getAllChats, { userId: user.user?.id || "" });
  const deleteChat = useMutation(api.chats.delete.deleteChat);

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
                return <ContextMenu key={_id}>
                  <ContextMenuTrigger asChild>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={`/chat/${_id}`}>{truncateString(title, 35)}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-28">
                    <ContextMenuItem onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/chat/${_id}`)
                      toast.info("Copied link to clipboard")
                    }}>
                      Share
                      <ContextMenuShortcut>
                        <SquareArrowOutUpRight className="size-4" />
                      </ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem className="text-red-500 focus:text-red-500" onClick={() => deleteChat({ _id })}>
                      Delete
                      <ContextMenuShortcut>
                        <Trash2 className="size-4 stroke-red-500" />
                      </ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>}
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hover:cursor-pointer">
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
                <DropdownMenuItem onClick={() => router.push("/wardrobe")}>
                  Wardrobe
                  <DropdownMenuShortcut>
                    <Shirt className="size-4" />
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