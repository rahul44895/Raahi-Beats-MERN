const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  favourites: [
    {
      _id: { type: Schema.Types.ObjectId },
      category: { type: String, enum: ["Artist", "Song"] },
    },
  ],
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
module.exports = mongoose.model("User", UserSchema);
