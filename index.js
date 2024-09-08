const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.MONGO_URI}/raahi-beats-mern`)
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/artists", require("./routes/ArtistsRoute.js"));
app.use("/api/playlist", require("./routes/PlaylistRoute.js"));
app.use("/api/songs", require("./routes/SongsRoute.js"));
app.use("/api/users", require("./routes/UsersRoute.js"));
app.use("/api/utils", require("./routes/UtilsRoute.js"));

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
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
