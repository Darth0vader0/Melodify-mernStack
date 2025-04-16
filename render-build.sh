#!/bin/bash

# Update package list and install ffmpeg
apt-get update && apt-get install -y ffmpeg

# Set execution permissions for yt-dlp binary
chmod +x ./backend/bin/yt-dlp