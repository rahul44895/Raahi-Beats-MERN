const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  public: {
    type: Boolean,
    default: false,
  },
  songs: [
    {
      _id: { type: mongoose.Types.ObjectId, ref: "Song", required: true },
      // title: { type: String, required: true, index: true },
      // artists: [
      //   {
      //     _id: {
      //       type: mongoose.Types.ObjectId,
      //       ref: "Artist",
      //       required: true,
      //     },
      //     name: {
      //       type: String,
      //       required: true,
      //     },
      //   },
      // ],
      // filePath: { type: String, required: true },
      // coverImage: { type: String, required: true },
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  playedCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
