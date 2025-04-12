"use client"

import { useState } from "react"
import { Search, Download, Play } from "lucide-react"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"

export function SpotifyContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const spotifyMusic = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      albumArt: "https://i.scdn.co/image/ab67616d0000b273373c63a4666fb7193febc167",
    },
    {
      id: 2,
      title: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
      duration: "2:47",
      albumArt: "https://i.scdn.co/image/ab67616d0000b273164feb363334f93b6458d2a9",
    },
    {
      id: 3,
      title: "Bad Habit",
      artist: "Steve Lacy",
      album: "Gemini Rights",
      duration: "3:52",
      albumArt: "https://i.scdn.co/image/ab67616d0000b273ef24c3fdbf856340d55cfeb2",
    },
    {
      id: 4,
      title: "Anti-Hero",
      artist: "Taylor Swift",
      album: "Midnights",
      duration: "3:20",
      albumArt: "https://i.scdn.co/image/ab67616d0000b273ef24c3fdbf856340d55cfeb2",
    },
    {
      id: 5,
      title: "Unholy",
      artist: "Sam Smith & Kim Petras",
      album: "Gloria",
      duration: "2:36",
      albumArt: "https://i.scdn.co/image/ab67616d0000b273373c63a4666fb7193febc167",
    },
    {
      id: 6,
      title: "Calm Down",
      artist: "Rema & Selena Gomez",
      album: "Rave & Roses",
      duration: "3:59",
      albumArt: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
    {
      id: 7,
      title: "Flowers",
      artist: "Miley Cyrus",
      album: "Endless Summer Vacation",
      duration: "3:20",
      albumArt: "https://i.scdn.co/image/ab67616d0000b273373c63a4666fb7193febc167",
    },
    {
      id: 8,
      title: "Kill Bill",
      artist: "SZA",
      album: "SOS",
      duration: "2:33",
      albumArt: "https://i.scdn.co/image/ab67616d0000b273164feb363334f93b6458d2a9",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 rounded-lg border bg-card p-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Spotify music..."
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {spotifyMusic.map((item) => (
            <Card key={item.id} className="group overflow-hidden transition-all hover:bg-accent">
              <CardContent className="p-3">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                  <img
                    src={item.albumArt || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="h-10 w-10">
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-10 w-10">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.artist}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.album}</span>
                  <span className="text-xs text-muted-foreground">{item.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Search Spotify Music</h2>
          <p className="text-muted-foreground">Type in the search bar to find your favorite Spotify tracks</p>
        </div>
      )}
    </div>
  )
}