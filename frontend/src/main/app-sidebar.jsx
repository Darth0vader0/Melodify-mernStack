"use client"

import { Home, Youtube, Music, Library, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../components/ui/sidebar"

export function AppSidebar({ activeNav, setActiveNav }) {
  const navItems = [
    {
      name: "home",
      icon: Home,
      label: "Home",
    },
    {
      name: "youtube",
      icon: Youtube,
      label: "YouTube",
    },
    {
      name: "spotify",
      icon: Music,
      label: "Spotify",
    },
    {
      name: "library",
      icon: Library,
      label: "Library",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Music className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Melodify</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name} className="group">
              <SidebarMenuButton
                isActive={activeNav === item.name}
                onClick={() => setActiveNav(item.name)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeNav === item.name
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted hover:text-muted-foreground"
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-transform ${activeNav === item.name ? "scale-110" : "group-hover:scale-110"
                    }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex w-full items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">Username</span>
                  <span className="text-xs text-muted-foreground">@nickname</span>
                </div>
                <Settings className="ml-auto h-4 w-4" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}