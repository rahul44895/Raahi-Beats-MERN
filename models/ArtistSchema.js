const mongoose = require("mongoose");
const { Schema } = mongoose;

const ArtistSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  songs: [{ _id: { type: mongoose.Types.ObjectId, ref: "Songs" } }],
  playedCount: { type: Number, default: 0 },
  likedCount: { type: Number, default: 0 },
  shortenURL: { type: String, required: true },
});
module.exports = mongoose.model("Artist", ArtistSchema);
