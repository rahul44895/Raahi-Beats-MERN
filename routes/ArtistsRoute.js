const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const deleteFiles = require("../Utils/DeleteFile");
const ArtistSchema = require("../models/ArtistSchema");
const SongsSchema = require("../models/SongSchema");

//POST - Add Artists
router.post(
  "/add",
  upload.fields([{ name: "artistImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { title } = req.body;
      if (!req.files?.["artistImage"]?.[0] || !title) {
        if (req.files?.["artistImage"]?.[0]) deleteFiles(req.files);
        return res.status(400).json({
          success: false,
          error: "All fields are required",
        });
      }
      let artist = await ArtistSchema.findOne({
        name: { $regex: title, $options: "i" },
      });
      if (artist) {
        deleteFiles(req.files);
        return res.status(201).json({
          success: false,
          error: "Artist already exists in the database.",
        });
      }
      artist = new ArtistSchema({
        name: title,
        avatar:
          req.files && req.files["artistImage"][0]
            ? req.files["artistImage"][0].path
            : "",
        songs: [],
      });
      let songs = await SongsSchema.find();
      let tempSong = [];
      for (const currSong of songs) {
        let updated = false;
        currSong.artists.forEach((currArtist) => {
          if (currArtist.name.toLowerCase() === title.toLowerCase()) {
            currArtist._id = artist._id;
            updated = true;
          }
        });

        if (updated) {
          await currSong.save();
          tempSong.push({ _id: currSong._id });
        }
      }
      artist.songs = tempSong ? tempSong : [];
      await artist.save();
      res
        .status(200)
        .json({ success: true, message: "Artist saved successfully", artist });
    } catch (error) {
      console.log(error);
      deleteFiles(req.files);
      res.status(500).json({
        success: false,
        error: "Some error occured while saving the artist info.",
      });
    }
  }
);

// POST - Get Artists
router.post("/", async (req, res) => {
  try {
    let artists;
    let total;
    if (req.body.id) {
      artists = await ArtistSchema.findById(req.body.id);
      total = await ArtistSchema.countDocuments({ _id: req.body.id });
    } else {
      let countOfArtists = req.body.countOfArtists || 0;
      artists = ArtistSchema.aggregate([
        {
          $addFields: {
            score: {
              $add: [
                { $multiply: ["$likedCount", 0.5] },
                { $multiply: ["$playedCount", 0.5] },
              ],
            },
          },
        },
        { $sort: { score: -1 } },
      ]);

      if (countOfArtists > 0) {
        artists.limit(countOfArtists);
      }

      artists = artists.sort({ name: 1 });
      artists = await artists.exec();
      total = artists.length;
    }
    let tempArtists = JSON.parse(JSON.stringify(artists));
    if (artists && req.body.id) {
      tempArtists.songs = await Promise.all(
        tempArtists.songs.map(async (currSong) => {
          let song = await SongsSchema.findById(currSong._id);
          return song;
        })
      );
      tempArtists.songs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      for (const currArtist in tempArtists) {
        tempArtists[currArtist].songs = [];
      }
    }
    res.status(200).json({ success: true, total, artists: tempArtists });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Some error occured while fetching the artist info.",
    });
  }
});

module.exports = router;
