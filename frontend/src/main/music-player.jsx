import { useState, useEffect, useRef } from "react";
import { Search, Download, Play, Loader2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function MusicPlayer({  onClose, currentSong, loading })  {
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Use currentSong from state
  const song = currentSong;

  // Format time in mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };


 
  // Update time as audio plays
  // Update useEffect to handle metadata loading properly
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  // Make sure to set initial values when component mounts
  if (audio.readyState > 0) {
    setDuration(audio.duration);
    setCurrentTime(audio.currentTime);
  }

  const updateTime = () => setCurrentTime(audio.currentTime);
  
  const handleLoadedMetadata = () => {
    setDuration(audio.duration);
    // If the audio should be playing, ensure it starts
    if (isPlaying) {
      audio.play().catch(err => console.error("Playback failed:", err));
    }
  };
  
  const handleEnded = () => setIsPlaying(false);

  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("loadedmetadata", handleLoadedMetadata);
  audio.addEventListener("ended", handleEnded);

  return () => {
    audio.removeEventListener("timeupdate", updateTime);
    audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    audio.removeEventListener("ended", handleEnded);
  };
}, [isPlaying]); // Add isPlaying to dependencies

// Improve the handleSeek function to be more robust
const handleSeek = (e) => {
  if (!audioRef.current || !duration) return;
  
  const progressBar = e.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const seekPosition = (e.clientX - rect.left) / progressBar.clientWidth;
  const seekTime = seekPosition * duration;
  
  if (audioRef.current) {
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-md z-50">
      {loading ? (
        // Loading screen
        <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white">Loading...</h2>
        <p className="text-sm text-gray-400 mt-2">Preparing your song...</p>
      </div>
      ) : (
        // Music player content
        <>
          {/* Hidden audio element to handle actual playback */}
          <audio
  autoPlay={isPlaying}
  ref={audioRef}
  src={song?.url || ""}
  preload="metadata"
  onError={(e) => console.error("Audio error:", e)}
/>

          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-800">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPlaying ? "bg-green-500 animate-pulse" : "bg-purple-500"
                  }`}
                ></span>
                <p className="text-sm font-medium text-gray-400">
                  {isPlaying ? "Now Playing" : "Ready to Play"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center">
              <div className="relative mb-6 group">
                <img
                  src={song?.thumbnail || song.thumbnailUrl}
                  alt={song?.title}
                  className={`w-56 h-56 rounded-lg object-cover shadow-lg transition-transform duration-300 ${
                    isPlaying ? "scale-105" : ""
                  }`}
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {song?.title}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {song?.artist || "Unknown artist"}
              </p>

              {/* Progress bar */}
              <div className="w-full mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div
                  className="h-1 w-full bg-gray-800 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Player controls */}
              <div className="flex items-center justify-between w-full mt-4">
                <button className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                </button>

                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="19 20 9 12 19 4 19 20"></polygon>
                      <line x1="5" y1="19" x2="5" y2="5"></line>
                    </svg>
                  </button>

                  <button
                    onClick={togglePlay}
                    className={`p-3 rounded-full transition-colors ${
                      isPlaying
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    )}
                  </button>

                  <button className="text-gray-400 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 4 15 12 5 20 5 4"></polygon>
                      <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                  </button>
                </div>

                <button className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
