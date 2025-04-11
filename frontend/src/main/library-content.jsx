"use client"

import { Heart, Play, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export function LibraryContent() {
  const likedSongs = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20" },
    { id: 2, title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:47" },
    { id: 3, title: "Bad Habit", artist: "Steve Lacy", album: "Gemini Rights", duration: "3:52" },
    { id: 4, title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights", duration: "3:20" },
    { id: 5, title: "Unholy", artist: "Sam Smith & Kim Petras", album: "Gloria", duration: "2:36" },
  ]

  const userPlaylists = [
    { id: 1, title: "Chill Vibes", songs: 24, image: "/placeholder.svg?height=150&width=150" },
    { id: 2, title: "Workout Mix", songs: 18, image: "/placeholder.svg?height=150&width=150" },
    { id: 3, title: "Focus Flow", songs: 32, image: "/placeholder.svg?height=150&width=150" },
    { id: 4, title: "Party Hits", songs: 45, image: "/placeholder.svg?height=150&width=150" },
  ]

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="liked">
        <TabsList className="mb-6">
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="playlists">Your Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="liked">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-pink-600 to-purple-600">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Liked Songs</h2>
                <p className="text-muted-foreground">{likedSongs.length} songs</p>
              </div>
            </div>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Play All
            </Button>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y">
              {likedSongs.map((song, index) => (
                <div key={song.id} className="grid grid-cols-12 items-center gap-4 px-4 py-2 hover:bg-accent/50">
                  <div className="col-span-1 text-muted-foreground">{index + 1}</div>
                  <div className="col-span-5">
                    <div className="font-medium">{song.title}</div>
                    <div className="text-sm text-muted-foreground">{song.artist}</div>
                  </div>
                  <div className="col-span-3 text-muted-foreground">{song.album}</div>
                  <div className="col-span-2 text-muted-foreground">{song.duration}</div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="playlists">
          <h2 className="mb-4 text-2xl font-bold">Your Playlists</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {userPlaylists.map((playlist) => (
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
        </TabsContent>
      </Tabs>
    </div>
  )
}