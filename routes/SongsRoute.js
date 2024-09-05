const express = require("express");
const router = express.Router();
const SongsSchema = require("../models/SongSchema");
const upload = require("../middlewares/multer");
const deleteFiles = require("../Utils/DeleteFile");
const decodeToken = require("../middlewares/decodeToken");
const ArtistSchema = require("../models/ArtistSchema");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

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

      let song = await SongsSchema.findOne({
        title: { $regex: req.body.title.trim(), $options: "i" },
      });
      if (song) {
        return res.status(400).json({
          success: false,
          error: "Song already found in the database ",
          song,
        });
      }
      // Create a new Song document
      let artists = req.body.artists || undefined;
      const newSong = new SongsSchema({
        title: title.trim(),
        artists: artists,
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
      let tempArtistArr = [];
      if (artists) {
        for (const key in artists) {
          const currArtist = artists[key];
          let artist = await ArtistSchema.findOne({
            name: currArtist.name.trim(),
          });
          if (artist) {
            let songsArr = JSON.parse(JSON.stringify(artist.songs));
            songsArr.push({ _id: newSong._id.toString() });
            artist.songs = songsArr;
          } else {
            artist = new ArtistSchema({
              name: currArtist.name.trim(),
              avatar: "undefined",
              songs: [{ _id: newSong._id.toString() }],
            });
          }
          await artist.save();
          tempArtistArr.push({ _id: artist._id, name: artist.name });
        }
      }
      newSong.artists = tempArtistArr;
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

router.post("/", async (req, res) => {
  const { search } = req.query;
  let songs;

  let searchQuery = {};
  if (search) {
    const isObjectId = mongoose.Types.ObjectId.isValid(search);
    searchQuery = {
      $or: [
        ...(isObjectId ? [{ _id: search }] : []),
        { title: { $regex: search, $options: "i" } },
        { "artists.name": { $regex: search, $options: "i" } },
        { album: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } },
      ],
    };
  }

  songs = await SongsSchema.find({ ...searchQuery }).sort({ title: 1 });

  res.status(200).json({ success: true, total: songs.length, songs });
});

// GET route to fetch new release songs
router.get("/get/newrelease", async (req, res) => {
  try {
    const contentsPerPage = 10;
    const songs = await SongsSchema.find()
      .sort({ releaseDate: -1 })
      .limit(contentsPerPage);
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
      .limit(contentsPerPage);
    const total = songs.length;
    res.status(200).json({ total, songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while fetching songs",
    });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Please, provide the ID of the song to be deleted.",
      });
    }

    let song = await SongsSchema.findByIdAndDelete(_id);

    if (!song) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found." });
    }
    const lastBackslashIndex = song.filePath.lastIndexOf("\\");
    let songPath = song.filePath.slice(0, lastBackslashIndex);

    if (fs.existsSync(songPath)) {
      fs.rm(songPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`Error removing directory: ${err.message}`);
        } else {
          console.log(`Directory ${songPath} successfully removed.`);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Song deleted successfully",
      deletedSong: song,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// update the artist IDs in all the songs
router.put("/update/songs/artists", async (req, res) => {
  let songs = await SongsSchema.find();
  let artistNotInDataBase = [];
  for (const currSong of songs) {
    currSong.artists = await Promise.all(
      currSong.artists.map(async (currArtist) => {
        const artist = await ArtistSchema.findOne({
          name: currArtist.name.trim(),
        });
        if (!artist) {
          artistNotInDataBase.push(currArtist.name.trim());
          let newArtist = await ArtistSchema({
            name: currArtist.name.trim(),
            avatar: "undefined",
            songs: [{ _id: currSong._id }],
          });
          await newArtist.save();
          return { ...currArtist, _id: newArtist._id };
        } else {
          return { ...currArtist, _id: artist._id };
        }
      })
    );
    await currSong.save();
  }

  res.json({ total: artistNotInDataBase.length, artistNotInDataBase });
});

module.exports = router;
