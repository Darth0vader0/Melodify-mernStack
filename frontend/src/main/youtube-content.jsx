"use client";

import { useState } from "react";
import { Search, Download, Play } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function YouTubeContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const youtubeMusic = [
    {
      id: 1,
      title: "Shape of You",
      artist: "Ed Sheeran",
      views: "5.6B views",
      duration: "4:23",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 2,
      title: "Despacito",
      artist: "Luis Fonsi ft. Daddy Yankee",
      views: "7.8B views",
      duration: "4:41",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 3,
      title: "See You Again",
      artist: "Wiz Khalifa ft. Charlie Puth",
      views: "5.4B views",
      duration: "3:58",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 4,
      title: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      views: "4.5B views",
      duration: "4:31",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 5,
      title: "Gangnam Style",
      artist: "PSY",
      views: "4.3B views",
      duration: "4:13",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 6,
      title: "Sugar",
      artist: "Maroon 5",
      views: "3.6B views",
      duration: "5:01",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 rounded-lg border bg-card p-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search YouTube music..."
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {youtubeMusic.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="group relative">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="secondary">
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                    {item.duration}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.artist}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.views}</p>
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
          <h2 className="text-2xl font-bold">Search YouTube Music</h2>
          <p className="text-muted-foreground">Type in the search bar to find your favorite YouTube music</p>
        </div>
      )}
    </div>
  );
}