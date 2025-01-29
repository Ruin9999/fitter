import "./globals.css";
import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

import { CustomSidebar } from "@/components/layout/sidebar";

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "fitter - Find Your Perfect Fit",
  description: "Discover the latest fashion trends and find clothes that fit you perfectly.",
};

export default function RootLayout({
  children, 
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <ConvexClientProvider>
    <TooltipProvider delayDuration={100}>
    <html lang="en">
      <body className={`${pacifico.variable} antialiased`}>
        <SidebarProvider>
          <CustomSidebar />
          {/* <SidebarTrigger className="size-8"/> */}
          {children}
        </SidebarProvider>
      </body>
    </html>
    </TooltipProvider>
    </ConvexClientProvider>
    </ClerkProvider>
  );
}
