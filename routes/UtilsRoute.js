const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const SongSchema = require("../models/SongSchema");
const mongoose = require("mongoose");
const ArtistSchema = require("../models/ArtistSchema");
const { Schema } = mongoose;

let ShortenURLSchema = new Schema({
  songID: { type: Schema.Types.ObjectId, ref: "songs", required: true },
  shortenURL: { type: String, required: true },
});
ShortenURLSchema = mongoose.model("ShortenLinks", ShortenURLSchema);

router.post("/share-link", async (req, res) => {
  try {
    if (!req.body.songID) {
      return res.status(400).json({
        success: false,
        error: "Song ID is required to generate the shareable URL",
      });
    }
    const song = await SongSchema.findById(req.body.songID);
    if (!song) {
      return res.status(400).json({
        success: false,
        error: "Song not found in the database.",
      });
    }
    if (!song.shortenURL) {
      const uniqueID = shortid.generate();
      song.shortenURL = `${song.title.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      )}/${uniqueID}`;
      await song.save();
    }

    

    res.status(200).json({
      success: true,
      message: "Shareable link created successfully",
      songURL: `song/${song.shortenURL}`,
    });
  } catch (error) {
    console.error("Error generating unique ID:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while generating the shareable link",
    });
  }
});

router.post("/short-link/songs", async (req, res) => {
  try {
    const songs = await SongSchema.find();
    if (songs.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Songs not found in the database.",
      });
    }

    for (let currSong of songs) {
      const uniqueID = shortid.generate();
      currSong.shortenURL = `${currSong.title.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      )}/${uniqueID}`;
      await currSong.save();
    }

    res.status(200).json({
      success: true,
      message: "Shorten link created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "Internal server error occured while generating short links for the songs. ",
    });
  }
});


router.get("/short-link/artists", async (req, res) => {
  try {
    const artists = await ArtistSchema.find();
    if (artists.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Songs not found in the database.",
      });
    }

    for (let currArtist of artists) {
      const uniqueID = shortid.generate();
      currArtist.shortenURL = `${currArtist.name.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      )}/${uniqueID}`;
      await currArtist.save();
    }

    res.status(200).json({
      success: true,
      message: "Shorten link created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "Internal server error occured while generating short links for the songs. ",
    });
  }
});

module.exports = router;
