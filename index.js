const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const http = require("http");
const chatWebsocket = require("./websocket/chatWebsocket.js");

const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.MONGO_URI}/raahi-beats-mern`)
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error));

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.6:3000",
    "http://192.168.29.135:3000",
    "http://localhost:8000",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

//self calling code to keep the hosting platform online
const https = require("https");
setInterval(() => {
  https
    .get("https://raahi-beats-mern.onrender.com/", (res) => {
      let data = "";

      // A chunk of data has been received.
      res.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      res.on("end", () => {
        // console.log(`Response: ${data}`);
        console.log('Auto Checking: Server is online')
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
}, 600000); // Ping every 10 minutes

app.post("/api/deviceDetails", (req, res) => {
  console.log({ message: "User signing details", ip: req.ip, body: req.body });
  res.send("Received");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", require("./routes/UsersRoute.js"));
app.use("/api/songs", require("./routes/SongsRoute.js"));
app.use("/api/artists", require("./routes/ArtistsRoute.js"));
app.use("/api/playlist", require("./routes/PlaylistRoute.js"));
app.use("/api/utils", require("./routes/UtilsRoute.js"));
app.use("/api/chat", require("./routes/ChatsRoute.js"));

chatWebsocket(server);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
}
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
