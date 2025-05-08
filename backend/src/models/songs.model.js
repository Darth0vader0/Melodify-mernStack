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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    songTitle: { type: String, ref: "Song", required: true },
    spotify :{type: Boolean, default: false},
    youtube: { type: Boolean, default: false },
    artist: { type: String, required: true },
    PathUrl: { type: String, required: true },
    thumbnailUrl : { type: String },
    likedAt: { type: Date, default: Date.now },
});

const LikedSong = mongoose.model("LikedSong", likedSongSchema);

const downloadedSongSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    songTitle: { type: String, ref: "Song", required: true },
    spotify :{type: Boolean, default: false},
    youtube: { type: Boolean, default: false },
    artist: { type: String, required: true },
    PathUrl: { type: String, required: true },
    thumbnailUrl : { type: String },
    downloadedAt: { type: Date, default: Date.now },
});

const DownloadedSong = mongoose.model("DownloadedSong", downloadedSongSchema);

module.exports = {
    Song,
    LikedSong,
    DownloadedSong,
};