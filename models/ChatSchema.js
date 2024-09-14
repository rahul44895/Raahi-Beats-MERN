const mongoose = require("mongoose");
const { Schema } = mongoose;
const ChatSchema = new Schema({
  email: { type: String, required: true },
  socketID: { type: String },
  messages: [{ senderEmail: { type: String }, message: { type: String } }],
  user: { type: Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Chat", ChatSchema);
