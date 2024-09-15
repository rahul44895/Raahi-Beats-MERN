const mongoose = require("mongoose");
const { Schema } = mongoose;
const ChatSchema = new Schema({
  email: { type: String, required: true, index: true },
  socketID: { type: String, index: true },
  messages: [
    {
      senderEmail: { type: String },
      receiverEmail: { type: String },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Chat", ChatSchema);
