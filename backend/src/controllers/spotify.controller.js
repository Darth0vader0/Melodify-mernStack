const axios = require('axios');
const dotEnv = require('dotenv');
dotEnv.config();

class SpotifyController{
    static accessToken ='';
   static async getAccessToken(){
    const tokenUrl =  'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    try {
        const response = await axios.post(
            tokenUrl,
            new URLSearchParams({ grant_type: "client_credentials" }),
            {
                headers: {
                    "Authorization": `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        SpotifyController.accessToken = response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
    }
   }

   async searchOnSpotify(req,res){
    const query = req.query.q;
    if(!query){
        return res.status(400).json({error: 'Query parameter is required'});
    }
    if(!SpotifyController.accessToken){
        await SpotifyController.getAccessToken();
    }
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${SpotifyController.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        const tracks = response.data.tracks.items.map((item) => ({
            title: item.name,
            artist: item.artists[0].name,
            album: item.album.name,
            thumbnailUrl: item.album.images[0].url,
            trackId: item.id,
            trackUrl: item.external_urls.spotify,
        }));
        res.json({results: tracks});
    } catch (error) {
        if (error.response.status === 401) {
            // Access token expired, refresh it
            await SpotifyController.getAccessToken();
            // Retry the request with the new access token
            return this.searchOnSpotify(req, res);
        }
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: "Failed to fetch songs." });
    }
   }


}

module.exports = new SpotifyController();