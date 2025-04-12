const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  nickname: { type: String, required: true },
  avatarUrl: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDoKp0wum3Z8G1cQXa7j9UtFbpTYqG5YhUcg&s" },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
