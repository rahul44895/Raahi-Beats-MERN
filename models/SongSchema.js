const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  artists: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        ref: "Artist",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      shortenURL: { type: String },
    },
  ],
  album: { type: String, index: true },
  genre: { type: String, index: true },
  releaseDate: { type: Date },
  filePath: { type: String, required: true },
  coverImage: { type: String },
  playCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },

      username: {
        type: String,
        required: true,
      },
      comment: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  ratings: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      rating: String,
    },
  ],
  shortenURL: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update the updatedAt field
SongSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Song = mongoose.model("Song", SongSchema);

module.exports = Song;
