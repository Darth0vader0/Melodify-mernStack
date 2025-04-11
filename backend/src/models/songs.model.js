const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    youtubeId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    artist: { type: String },
    thumbnailUrl: { type: String },
    duration: { type: String }, // optional, like "3:25"
});


const Song = mongoose.model("Song", songSchema);

const likedSongSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
    likedAt: { type: Date, default: Date.now },
});

const LikedSong = mongoose.model("LikedSong", likedSongSchema);

const downloadedSongSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
    downloadedAt: { type: Date, default: Date.now },
});

const DownloadedSong = mongoose.model("DownloadedSong", downloadedSongSchema);

module.exports = {
    Song,
    LikedSong,
    DownloadedSong,
};