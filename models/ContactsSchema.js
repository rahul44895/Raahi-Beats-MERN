const mongoose = require("mongoose");
const { Schema } = mongoose;
const ContactsSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  socketID: { type: String },
});
module.exports = mongoose.model("Contact", ContactsSchema);
