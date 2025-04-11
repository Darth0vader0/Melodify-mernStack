"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { HomeContent } from "./home-content"
import { YouTubeContent } from "./youtube-content"
import { SpotifyContent } from "./spotify-content"
import { LibraryContent } from "./library-content"
import { UserNav } from "./user-nav"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar"

export function MusicApp() {
  const [activeNav, setActiveNav] = useState("home")

  const renderContent = () => {
    switch (activeNav) {
      case "home":
        return <HomeContent />
      case "youtube":
        return <YouTubeContent />
      case "spotify":
        return <SpotifyContent />
      case "library":
        return <LibraryContent />
      default:
        return <HomeContent />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold capitalize">{activeNav}</h1>
          </div>
          <UserNav />
        </header>
        <main className="h-[calc(100vh-4rem)] overflow-y-auto">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}