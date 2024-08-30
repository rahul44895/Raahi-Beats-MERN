const express = require("express");
const router = express.Router();
const SongsSchema = require("../models/SongSchema");
const upload = require("../middlewares/multer");
const deleteFiles = require("../Utils/DeleteFile");

// POST route to add a new song
router.post(
  "/add",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "filePath", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        album,
        genre,
        releaseDate,
        playCount,
        likes,
        comments,
        ratings,
      } = req.body;

      // Extract file paths
      const coverImage = req.files["coverImage"]
        ? req.files["coverImage"][0].path
        : null;
      const filePath = req.files["filePath"]
        ? req.files["filePath"][0].path
        : null;

      // Create a new Song document
      const newSong = new SongsSchema({
        title,
        artists: req.body.artists || undefined,
        album,
        genre,
        releaseDate: new Date(releaseDate),
        filePath,
        coverImage,
        playCount: playCount || 0,
        likes: likes || 0,
        comments: comments || undefined,
        ratings: ratings || undefined,
      });

      // Save the new song to the database
      await newSong.save();

      res.status(201).json({
        message: "Song added successfully",
        song: newSong,
      });
    } catch (err) {
      console.error(err);
      // Delete files if an error occurs
      deleteFiles(req.files);
      res.status(500).json({
        message: "An error occurred while adding the song",
        error: err.message,
      });
    }
  }
);

// POST route to fetch all songs
router.post("/get/all", async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { "artists.name": { $regex: search, $options: "i" } },
            { album: { $regex: search, $options: "i" } },
            { genre: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const contentsPerPage = 10;
    const skip = (Number(page) - 1) * contentsPerPage;
    const songs = await SongsSchema.find({ ...searchQuery })
      // .limit(contentsPerPage)
      // .skip(skip)
      .sort({ title: 1 });
    const total = songs.length;
    res.status(200).json({ total, songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while fetching songs",
    });
  }
});

// GET route to fetch new release songs
router.get("/get/newrelease", async (req, res) => {
  try {
    const contentsPerPage = 10;
    const songs = await SongsSchema.find()
      .sort({ releaseDate: -1 })
      .limit(contentsPerPage)
    const total = songs.length;
    res.status(200).json({ total, songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while fetching songs",
    });
  }
});

// GET route to fetch old songs
router.get("/get/oldsongs", async (req, res) => {
  try {
    const contentsPerPage = 10;

    const dateTwentyYearsAgo = new Date();
    dateTwentyYearsAgo.setFullYear(dateTwentyYearsAgo.getFullYear() - 20);

    const songs = await SongsSchema.find({
      releaseDate: { $lte: dateTwentyYearsAgo },
    })
      .sort({ releaseDate: -1 })
      .limit(contentsPerPage)
    const total = songs.length;
    res.status(200).json({ total, songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while fetching songs",
    });
  }
});

module.exports = router;
