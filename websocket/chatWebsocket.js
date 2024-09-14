const { Server } = require("socket.io");
const JWT = require("jsonwebtoken");
const UserSchema = require("../models/UserSchema");
const ContactsSchema = require("../models/ContactsSchema");
const ChatSchema = require("../models/ChatSchema");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { v4: uuid } = require("uuid");

const chatWebsocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.6:3000",
        "http://localhost:8000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const chatNameSpace = io.of("/api/chatnamespace");
  chatNameSpace.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    // REGISTRATION
    socket.on("register", async (msg) => {
      const { token } = msg;
      if (!token) {
        return chatNameSpace.to(socket.id).emit("registerResponse", {
          sucess: false,
          error: "Login is required.",
        });
      }
      const decodedToken = JWT.verify(token, JWT_SECRET_KEY)?.userID;
      const existingUser = await UserSchema.findById(decodedToken);
      if (!existingUser) {
        return chatNameSpace.to(socket.id).emit("registerResponse", {
          success: false,
          error: "User not found.",
        });
      }
      const contact = await ChatSchema.findOne({
        email: existingUser.email,
      });
      if (!contact) {
        const newContact = new ChatSchema({
          email: existingUser.email,
          socketID: socket.id,
          user: decodedToken,
        });
        await newContact.save();
      } else {
        contact.socketID = socket.id;
        await contact.save();
      }
      chatNameSpace.to(socket.id).emit("registerResponse", {
        success: true,
        message: "Registered...",
      });
    });

    //   CHATTING
    socket.on("private-message", async (data) => {
      const senderEmail = await ChatSchema.findOne({ socketID: socket.id });
      let contact = await ChatSchema.findOne({ email: data.receiverEmail });
      if (!contact) {
        contact = new ChatSchema({
          email: data.receiverEmail,
          messages: [{ senderEmail: senderEmail.email, message: data.message }],
        });
        await contact.save();
      } else {
        contact.messages = [
          ...contact.messages,
          { senderEmail: senderEmail.email, message: data.message },
        ];
        contact.save();
      }
      if (!contact.socketID) {
        chatNameSpace.to(socket.id).emit("registerResponse", {
          success: true,
          message: "Message not delivered.",
        });
      }

      chatNameSpace.to(contact.socketID).emit("server-message", {
        senderEmail: senderEmail.email,
        message: data.message,
        _id: uuid(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });
};
module.exports = chatWebsocket;
