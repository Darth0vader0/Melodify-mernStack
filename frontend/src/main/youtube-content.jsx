"use client";

import { useState, useEffect } from "react";
import { Search, Download, Play } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const backendUrl = import.meta.env.VITE_HOST_URL;

export function YouTubeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [youtubeMusic, setYoutubeMusic] = useState([]);
  const [input, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchYouTubeMusic = async () => {
      if (searchQuery.trim() === "") {
        setYoutubeMusic([]);
        return;
      }

      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(
          `${backendUrl}/youtube/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch YouTube music");
        }
        const data = await response.json();
        const structuredData = data.map((item) => ({
          id: item.videoId,
          title: item.title,
          videoUrl: item.videoUrl,
          thumbnail: item.thumbnail, // Placeholder for now
          duration: item.duration,
        }));
        setYoutubeMusic(structuredData);
      } catch (error) {
        console.error("Error fetching YouTube music:", error);
        setYoutubeMusic([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchYouTubeMusic();
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 rounded-lg border bg-card p-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search YouTube music..."
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          value={input}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchQuery(input);
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {youtubeMusic.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-black rounded-lg">
              <CardContent className="p-0">
                <div className="group relative">
                  <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-all group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 rounded-lg">
                    <Button size="icon" variant="secondary">
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="bg-black text-white p-3">
                  <h3 className="font-semibold truncate text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {item.artist || "Unknown artist"}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{item.album || "Album"}</span>
                    <span>{item.duration || "0:00"}</span>
                  </div>
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
          <p className="text-muted-foreground">
            Type in the search bar to find your favorite YouTube music
          </p>
        </div>
      )}
    </div>
  );
}