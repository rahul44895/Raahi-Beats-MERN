const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const deleteFiles = require("../Utils/DeleteFile");
const ArtistSchema = require("../models/ArtistSchema");
const SongsSchema = require("../models/SongSchema");
const { default: mongoose } = require("mongoose");

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
    const search = req.query.search;
    if (search) {
      let searchQuery = {};
      const isObjectId = mongoose.Types.ObjectId.isValid(search);
      searchQuery = {
        $or: [
          ...(isObjectId ? [{ _id: search }] : []),
          { name: { $regex: search, $options: "i" } },
          { shortenURL: search },
        ],
      };
      artists = await ArtistSchema.find({ ...searchQuery });
      total = await ArtistSchema.countDocuments({ ...searchQuery });
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

    if (artists && artists.length == 1) {
      tempArtists = JSON.parse(JSON.stringify(artists[0]));

      tempArtists.songs = await Promise.all(
        tempArtists.songs.map(async (currSong) => {
          const song = await SongsSchema.findById(currSong._id);
          if (song) {
            song.artists = await Promise.all(
              song.artists.map(async (currArtist) => {
                const temp = await ArtistSchema.findById(currArtist._id);
                return temp || null; // Return null if not found
              })
            );
            return song;
          }
          return null; // Return null if song not found
        })
      ).then((songs) => songs.filter((song) => song)); // Filter out nulls

      tempArtists.songs.sort((a, b) => {
        if (a.title) return a.title.localeCompare(b.title);
      });
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

// update the song IDs in all the artists
router.put("/update/artists/songs", async (req, res) => {
  try {
    let songs = await SongsSchema.find();
    for (const currSong of songs) {
      let artists = currSong.artists;
      if (artists) {
        for (const key in artists) {
          const currArtist = artists[key];
          let artist = await ArtistSchema.findOne({
            _id: currArtist._id,
          });
          if (artist) {
            let songsArr = JSON.parse(JSON.stringify(artist.songs));
            let condition = songsArr.some((e) => e._id == currSong._id);
            if (!condition) songsArr.push({ _id: currSong._id.toString() });
            artist.songs = songsArr;
          } else {
            artist = new ArtistSchema({
              name: currArtist.name.trim(),
              avatar: "undefined",
              songs: [{ _id: newSong._id.toString() }],
            });
          }
          await artist.save();
        }
      }
    }
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//delete all the songs from the artist array
router.delete("/delete/songs", async (req, res) => {
  let artists = await ArtistSchema.find();
  for (const currArtist of artists) {
    currArtist.songs = [];
    await currArtist.save();
  }
  res.send(artists);
});

module.exports = router;
