const { google } = require('googleapis');
const {exec} = require('child_process')
const os = require('os');
const dotEnv = require('dotenv');
dotEnv.config();

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ytDlpPath = path.join(__dirname, '../../bin/yt-dlp');



const cookiePath = path.resolve(__dirname, '../../bin/cookie.txt');

// Decode and save the cookie


const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API,    
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class YoutubeController {
    static parseYouTubeDuration(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const seconds = match[3] ? parseInt(match[3]) : 0;

        return hours * 3600 + minutes * 60 + seconds;
    }

    static async searchOnYoutube(query) {
        
        const youtube = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY,
        });

        try {
            const response = await youtube.search.list({
                part: 'snippet',
                q: query+" music",
                type: 'video',
                maxResults: 10,
            });
            const videoIds = response.data.items.map(item => item.id.videoId).join(',');

            // Step 2: Fetch details for the videos, including duration
            const detailsResponse = await youtube.videos.list({
                part: 'snippet,contentDetails',
                id: videoIds,
                key: process.env.YOUTUBE_API_KEY,
            });
    
            // Step 3: Filter videos based on duration (2 to 8 minutes)
            const results = detailsResponse.data.items
                .filter(item => {
                    const duration = item.contentDetails.duration;
                    const totalSeconds = YoutubeController.parseYouTubeDuration(duration);
                    return totalSeconds >= 120 && totalSeconds <= 480; // 
                })
                .map(item => ({
                    title: item.snippet.title,
                    videoId: item.id,
                    videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
                    thumbnail: item.snippet.thumbnails.high.url, // Use the high-quality thumbnail
                    duration:item.contentDetails.duration,
                }));
    
            return results;

        } catch (error) {
            console.error('Error searching on YouTube:', error);
            return [];
        }
    }

    async fetchYoutubeVideo(req, res) {
        console.log("Fetching Youtube Video")
        try {
            const query = req.query.q || "never gonna give up";
            const results = await YoutubeController.searchOnYoutube(query);
            res.json(results);
        } catch (error) {
            console.log('Error fetching YouTube data:', error);
            res.status(500).json({ error: 'Error fetching YouTube data' });
        }
    }

    async downloadYoutubeVideo(req, res) {
        console.log("Fetching YouTube MP3 and uploading to Cloudinary");
        console.log("Using cookies from:", cookiePath);
        try {
            const videoUrl = req.body.url;
            const vidTitle = req.body.title;

            const safeTitle = vidTitle.replace(/[^\w\-]+/g, '_');
            const uniqueFileName = `audio_${safeTitle}_${Date.now()}`;

            const ytProcess = spawn(ytDlpPath, [
                '--cookies', cookiePath,
                '-x',
                '--audio-format', 'mp3',
                '--audio-quality', '0',
                '-o', '-', // stdout
                videoUrl
            ]);

            const cloudinaryStream = cloudinary.uploader.upload_stream({
                resource_type: 'video',
                folder: 'melodify-youtube-music',
                public_id: uniqueFileName,
                format: 'mp3',
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ error: 'Cloudinary upload error' });
                }

                console.log('Cloudinary upload result:', result);
                return res.status(200).json({
                    message: 'File uploaded successfully',
                    url: result.secure_url,
                    public_id: result.public_id,
                    title:safeTitle
                });
            });

            ytProcess.stdout.pipe(cloudinaryStream);

            ytProcess.stderr.on('data', (data) => {
                console.error(`yt-dlp stderr: ${data}`);
            });

            ytProcess.on('error', (err) => {
                console.error('yt-dlp process error:', err);
                return res.status(500).json({ error: 'Error spawning yt-dlp process' });
            });

            ytProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`yt-dlp exited with code ${code}`);
                    cloudinaryStream.end();
                }
            });

        } catch (err) {
            console.error('Unexpected error in download handler:', err);
            return res.status(500).json({ error: 'Server error while processing the request' });
        }
    }

    
}

module.exports = new YoutubeController();