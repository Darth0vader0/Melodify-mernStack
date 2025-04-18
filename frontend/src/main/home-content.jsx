"use client"

import { Clock, Play } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "../components/ui/card"

export function HomeContent() {
  const playlists = [
    { id: 1, title: "Chill Vibes", songs: 24, image: "https://i.scdn.co/image/ab67616d0000b273373c63a4666fb7193febc167" },
    { id: 2, title: "Workout Mix", songs: 18, image: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228" },
    { id: 3, title: "Focus Flow", songs: 32, image: "https://i.scdn.co/image/ab67616d0000b273495ce6da9aeb159e94eaa453" },
    { id: 4, title: "Party Hits", songs: 45, image: "https://i.scdn.co/image/ab67616d0000b2738c8ba392dfd178ecc12010fd" },
    { id: 5, title: "Throwbacks", songs: 28, image: "https://i.scdn.co/image/ab67616d0000b273177b49f0c89d4ec4ca73726a" },
    { id: 6, title: "New Releases", songs: 15, image: "https://i.scdn.co/image/ab67616d0000b273164feb363334f93b6458d2a9" },
  ]

  const recentHistory = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      type: "search",
      image: "https://i.scdn.co/image/ab67616d0000b273164feb363334f93b6458d2a9",
    },
    {
      id: 2,
      title: "As It Was",
      artist: "Harry Styles",
      type: "download",
      image: "https://i.scdn.co/image/ab67616d0000b2738c8ba392dfd178ecc12010fd",
    },
    { id: 3, title: "Bad Habit", artist: "Steve Lacy", type: "search", image: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228" },
    {
      id: 4,
      title: "Anti-Hero",
      artist: "Taylor Swift",
      type: "download",
      image: "https://i.scdn.co/image/ab67616d0000b273373c63a4666fb7193febc167",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Your Playlists</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="group overflow-hidden transition-all hover:bg-accent">
              <CardContent className="p-3">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                  <img
                    src={playlist.image || "/placeholder.svg"}
                    alt={playlist.title}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <Play className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-base">{playlist.title}</CardTitle>
                <CardDescription>{playlist.songs} songs</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
        <div className="rounded-lg border bg-card">
          <div className="divide-y">
            {recentHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-accent/50">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    {item.type === "search" ? "Searched" : "Downloaded"}
                  </span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}