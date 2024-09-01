const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.MONGO_URI}raahi-beats-mern`)
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error));

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.sendFile("client/build/index.html");
});

app.use("/api/songs", require("./routes/SongsRoute"));
app.use("/api/playlist", require("./routes/PlaylistRoute"));
app.use("/api/artists", require("./routes/ArtistsRoute.js"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
