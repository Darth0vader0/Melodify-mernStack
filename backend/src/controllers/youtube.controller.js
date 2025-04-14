const { google } = require('googleapis');
const {exec} = require('child_process')
const dotEnv = require('dotenv');
dotEnv.config();


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
}

module.exports = new YoutubeController();