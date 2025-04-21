const { google } = require('googleapis');
const {exec} = require('child_process')
const os = require('os');
const dotEnv = require('dotenv');
dotEnv.config();

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ytDlpPath = path.join(__dirname, '../../bin/yt-dlp');
const CookieDecryptor = require('../config/decrypt');
const NgrokURL = require('../models/ng.model');



// Decode and save the cookie
const decryptor = new CookieDecryptor(process.env.ENCRYPTION_SECRET);
const encryptedCookies = process.env.ENCRYPTED_COOKIES; // Replace with actual encrypted data
const decryptedCookies = decryptor.decrypt(encryptedCookies);


const tempCookiePath = path.join(os.tmpdir(), `cookie_${Date.now()}.txt`);
fs.writeFileSync(tempCookiePath, decryptedCookies);


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
    async getNgrokUrl(req, res) {
        try {
            console.log("Fetching Ngrok URL")
            // Fetch the latest URL from the database (you can adjust this based on your logic)
            const ngrokUrlData = await NgrokURL.findOne().sort({ createdAt: -1 });
        
            if (!ngrokUrlData) {
              return res.status(404).json({ message: 'URL not found' });
            }
        
            // Respond with the URL
            res.status(200).json({ url: ngrokUrlData.url });
          } catch (err) {
            console.error('Error fetching URL:', err);
            res.status(500).json({ message: 'Error fetching URL from database' });
          }

    }

    async downloadYoutubeVideo(req, res) {
        console.log("Fetching YouTube MP3 and uploading to Cloudinary");
        
        try {
            const videoUrl = req.body.url;
            const vidTitle = req.body.title;

            const safeTitle = vidTitle.replace(/[^\w\-]+/g, '_');
            const uniqueFileName = `audio_${safeTitle}_${Date.now()}`;

            const ytProcess = spawn(ytDlpPath, [
                '--cookies', tempCookiePath,
                '--proxy', 'http://bywqkxjo:37oxzyzxfokw@38.153.152.244:9594',
                '-x',
                '--audio-format', 'mp3',
                '--audio-quality', '0',
                '--limit-rate', '500K',
                '--socket-timeout', '30', // Increased timeout
                '--retries', '5',         // Retry up to 5 times
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

    async downloadSpotifyTrack(req, res) {
    console.log("Fetching Spotify track via YouTube and uploading to Cloudinary");

    try {
      const { name, artist } = req.body;
      const query = `${name} ${artist}`;
      const safeTitle = `${name}_${artist}`.replace(/[^\w\-]+/g, '_');
      const uniqueFileName = `spotify_${safeTitle}_${Date.now()}`;

      const ytProcess = spawn(ytDlpPath, [
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '--limit-rate', '500K',
        '--socket-timeout', '30',
        '--retries', '5',
        '-o', '-', // stdout
        `ytsearch1:${query}`
      ]);

      const cloudinaryStream = cloudinary.uploader.upload_stream({
        resource_type: 'video',
        folder: 'melodify-spotify-music',
        public_id: uniqueFileName,
        format: 'mp3',
      }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Cloudinary upload error' });
        }

        console.log('Upload successful:', result);
        return res.status(200).json({
          message: 'File uploaded successfully',
          url: result.secure_url,
          public_id: result.public_id,
          title: safeTitle
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
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Server error while processing request' });
    }
  }
    
}

module.exports = new YoutubeController();