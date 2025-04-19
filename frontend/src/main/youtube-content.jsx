import { useState, useEffect } from "react";
import { Search, Download, Play, Loader2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const backendUrl = import.meta.env.VITE_HOST_URL;

export function YouTubeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [youtubeMusic, setYoutubeMusic] = useState([]);
  const [input, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentDownload, setCurrentDownload] = useState(null);

  const downloadYoutubeVideo = async (item) => {
    setDownloading(true);
    setCurrentDownload(item);
    setDownloadProgress(0);
    
    // Start a progress simulation for better UX
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        // Cap progress at 90% during actual download
        // The last 10% will complete when download is actually done
        return prev < 90 ? prev + 5 : prev;
      });
    }, 300);
    
    try {
      const ngrokResponse = await fetch(`${backendUrl}/getNgrokUrl`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const ngrokData = await ngrokResponse.json();

      // Make request to backend to download YouTube video
      const response = await fetch(`${ngrokData.url}/downloadYoutubeMusic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          url: item.videoUrl,
          title: item.title,
        }),
      });

      if (!response.ok) {
        console.error("Failed to download video. Response:", response);
        throw new Error("Failed to download video");
      }

      const data = await response.json();
      const url = data.url;
      const downloadUrl = url.replace("/upload/", `/upload/fl_attachment:${data.title}/`);

      
      // Set download to 100% when complete
      setDownloadProgress(100);
      
      // Create and trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = `${data.title}.mp3`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Keep the completion message visible for a moment
      setTimeout(() => {
        setDownloading(false);
        setCurrentDownload(null);
      }, 2500);
      
    } catch (error) {
      console.error("Download failed:", error);
      setDownloading(false);
      setCurrentDownload(null);
      alert("Failed to download the song.");
    } finally {
      clearInterval(progressInterval);
    }
  };

  const cancelDownload = () => {
    // In a real implementation, you would abort the fetch if possible
    setDownloading(false);
    setCurrentDownload(null);
    setDownloadProgress(0);
  };

  useEffect(() => {
    const fetchYouTubeMusic = async () => {
      if (searchQuery.trim() === "") {
        setYoutubeMusic([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/youtube/search?q=${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch YouTube music");
        }
        const data = await response.json();
        const structuredData = data.map((item) => ({
          id: item.videoId,
          title: item.title,
          videoUrl: item.videoUrl,
          thumbnail: item.thumbnail,
          duration: item.duration,
        }));
        setYoutubeMusic(structuredData);
      } catch (error) {
        console.error("Error fetching YouTube music:", error);
        setYoutubeMusic([]);
      } finally {
        setLoading(false);
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
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => {
                        downloadYoutubeVideo(item);
                      }}
                    >
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

      {/* Enhanced Downloading Popup */}
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
    </div>
  );
}