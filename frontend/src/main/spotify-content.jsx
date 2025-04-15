"use client"

import { useState, useEffect } from "react"
import { Search, Download, Play } from "lucide-react"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"


export function SpotifyContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [spotifyMusic, setSpotifyMusic] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInputValue] = useState("")
  useEffect(() => {
    const fetchMusic = async () => {
      if (!searchQuery) {
        setSpotifyMusic([]) // Clear results if the search query is empty
        return
      }

      setLoading(true)
      try {

        const response = await fetch(
          `${import.meta.env.VITE_HOST_URL}/spotify/search?q=${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        )
        if (!response.ok) {
          throw new Error("Failed to fetch Spotify music")
        }
        const data = await response.json()
        const structuredData = data.results.map((item) => ({
          title: item.title,
          artist: item.artist,
          album: item.album,
          thumbnailUrl: item.thumbnailUrl || "/placeholder.svg",
          trackId: item.trackId,
          trackUrl: item.trackUrl,
        }))
        setSpotifyMusic(structuredData)

      } catch (error) {
        console.error("Error fetching Spotify music:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceFetch = setTimeout(fetchMusic, 500) // Debounce API calls
    return () => clearTimeout(debounceFetch)
  }, [searchQuery])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 rounded-lg border bg-card p-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Spotify music..."
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          value={input}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchQuery(input)
            }
          }}
        />
      </div>

      {loading ? (
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Search className="h-12 w-12 text-muted-foreground animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      ) : searchQuery ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {spotifyMusic.map((item) => (
            <Card key={item.trackId} className="group overflow-hidden transition-all hover:bg-accent">
              <CardContent className="p-3">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                  <img
                    src={item.thumbnailUrl || "/placeholder.svg"}
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