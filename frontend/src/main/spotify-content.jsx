"use client"

import { useState, useEffect } from "react"
import { Search, Download, Play, Loader2 } from "lucide-react"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
const backendUrl = import.meta.env.VITE_HOST_URL;
import { MusicPlayer } from "./music-player"
export function SpotifyContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [spotifyMusic, setSpotifyMusic] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInputValue] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentDownload, setCurrentDownload] = useState(null)
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const playSong = async (item) => {
    try {
      setCurrentSong(item);
      setIsPlayerLoading(true); // Set loading to true before fetching
      setIsPlayerVisible(true);
  
      const ngrokResponse = await fetch(`${backendUrl}/getNgrokUrl`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      const ngrokData = await ngrokResponse.json();
  
      const response = await fetch(`${ngrokData.url}/downloadSpotifyMusic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: item.title,
          artist: item.artist,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch song URL");
      }
  
      const data = await response.json();
      const songUrl = data.url.replace(
        "/upload/",
        `/upload/fl_attachment:${data.title}/`
      );
      setIsPlayerLoading(false); // Set loading to false when the song URL is ready
      setCurrentSong({ ...item, url: songUrl });
    } catch (error) {
      console.error("Error playing song:", error);
      alert("Failed to play the song.");
      setIsPlayerLoading(false); // Ensure loading is reset on error
    }
  };

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

  const downloadSpotifyMusic = async (music) => {
    setDownloading(true)
    setCurrentDownload(music)
    setDownloadProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => (prev < 90 ? prev + 5 : prev))
    }, 300)

    try {
      const ngrokResponse = await fetch(`${backendUrl}/getNgrokUrl`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const ngrokData = await ngrokResponse.json()

      const response = await fetch(`${ngrokData.url}/downloadSpotifyMusic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: music.title,
          artist: music.artist,
        }),
      })

      if (!response.ok) {
        console.error("Failed to download music. Response:", response)
        throw new Error("Failed to download music")
      }

      const data = await response.json()
      const url = data.url
      const downloadUrl = url.replace("/upload/", `/upload/fl_attachment:${data.title}/`)

      setDownloadProgress(100)

      // Trigger download
      const downloadLink = document.createElement("a")
      downloadLink.href = downloadUrl
      downloadLink.download = `${data.title}.mp3`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      setTimeout(() => {
        setDownloading(false)
        setCurrentDownload(null)
      }, 2500)
    } catch (error) {
      console.error("Error downloading Spotify music:", error)
      setDownloading(false)
      setCurrentDownload(null)
      alert("Failed to download the song.")
    } finally {
      clearInterval(progressInterval)
    }
  }

  const cancelDownload = () => {
    setDownloading(false)
    setCurrentDownload(null)
    setDownloadProgress(0)
  }

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
                    <Button size="icon" variant="secondary" className="h-10 w-10"
                      onClick={() => playSong(item)}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10"
                      onClick={() => downloadSpotifyMusic(item)}
                    >
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

      {downloading && currentDownload && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
                {downloadProgress >= 100 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>

              <div className="w-full text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {downloadProgress >= 100 ? "Download Complete" : "Downloading..."}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
                  {currentDownload.title}
                </p>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>

              <div className="flex justify-between w-full">
                <span className="text-xs text-gray-500 dark:text-gray-400">{downloadProgress}%</span>
                {downloadProgress < 100 && (
                  <button
                    onClick={cancelDownload}
                    className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                  >
                    Cancel
                  </button>
                )}
                {downloadProgress >= 100 && (
                  <button
                    onClick={cancelDownload}
                    className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isPlayerVisible && currentSong && (
        <MusicPlayer
          currentSong={currentSong}
          onClose={() => setIsPlayerVisible(false)}
          loading={isPlayerLoading} // Pass the loading state
          // Pass the setLoading function
        />
      )}
    </div>
  )
}