const express = require("express");
const Playlist = require("../models/PlaylistSchema");
const Song = require("../models/SongSchema");
const decodeToken = require("../middlewares/decodeToken");
const router = express.Router();

router.post("/add", decodeToken, async (req, res) => {
  try {
    const { name, description, public } = req.body;
    const requiredFields = { name, description };

    // Check if all required fields are present
    for (let [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          error: `${key} is required`,
        });
      }
    }

    const newPlaylist = new Playlist({
      name,
      description,
      public,
      user: req.user,
    });
    await newPlaylist.save();

    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist: newPlaylist,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "An error occured while saving the playlist",
    });
  }
});

router.post("/get/private", decodeToken, async (req, res) => {
  try {
    const query = { user: req.user };
    if (req.body._id) query._id = req.body._id;
    let playlist = await Playlist.find(query);
    let tempPlaylist = JSON.parse(JSON.stringify(playlist));
    if (req.body._id) {
      tempPlaylist[0].songs = await Promise.all(
        tempPlaylist[0].songs.map(async (currSong) => {
          let song = await Song.findById(currSong._id);
          return song;
        })
      );
    }
    const total = tempPlaylist.length;
    res.status(200).json({ success: true, total, playlist: tempPlaylist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/get/public", async (req, res) => {
  try {
    const query = { public: true };
    if (req.body._id) query._id = req.body._id;
    let playlist = await Playlist.find(query);
    let tempPlaylist = JSON.parse(JSON.stringify(playlist));
    if (req.body._id) {
      tempPlaylist[0].songs = await Promise.all(
        tempPlaylist[0].songs.map(async (currSong) => {
          let song = await Song.findById(currSong._id);
          return song;
        })
      );
    }
    const total = tempPlaylist.length;
    res.status(200).json({ success: true, total, playlist: tempPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/update", decodeToken, async (req, res) => {
  try {
    let playlist = await Playlist.findById(req.body._id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    if (playlist.user.toString() !== req.user.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized access is not allowed" });
    }

    // Destructure the fields you want to update from req.body
    const { name, description, public, playedCount, likes, songs } = req.body;

    // Update the fields only if they exist in req.body
    if (name) playlist.name = name;
    if (description) playlist.description = description;
    if (public !== undefined) playlist.public = public; // Allow setting to false
    if (playedCount) {
      if (playedCount > playlist.playedCount)
        playlist.playedCount = playedCount;
      else {
        console.log("Given Playlist count is less than the actual one.");
      }
    }
    if (likes) playlist.likes = likes;
    if (songs && Array.isArray(songs)) {
      if (!req.body.playlistSongOrder) {
        let duplicates = [];
        songs.forEach((e) => {
          const songExists = playlist.songs.some((s) => s._id.equals(e._id));
          if (!songExists) {
            playlist.songs.push(e);
          } else {
            duplicates.push(e._id);
          }
        });

        if (duplicates.length > 0) {
          return res.status(409).json({
            message: "Some songs are already added in the playlist.",
          });
        }
      } else playlist.songs = songs;
    }

    // Update the lastUpdated timestamp
    playlist.lastUpdated = Date.now();

    // Save the updated playlist
    const updatedPlaylist = await playlist.save();

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Some error occurred while updating the playlist" });
    console.error(err);
  }
});

router.delete("/update/song", decodeToken, async (req, res) => {
  try {
    const { playlistID, songID } = req.body;
    let playlist = await Playlist.findById(playlistID);
    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, error: "No playlist found" });
    }
    if (playlist.user.toString() !== req.user.toString()) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized access is not allowed" });
    }

    let tempSongs = playlist.songs.filter(
      (curr) => curr._id.toString() !== songID
    );

    playlist.songs = tempSongs;
    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Song successfully deleted from the playlist.",
    });
  } catch (err) {
    console.log({ user: req.user, error: err });
    res.status(500).json({
      success: false,
      error: "Some error occured",
    });
  }
});

router.delete("/delete", decodeToken, async (req, res) => {
  try {
    const { _id } = req.body;
    const playlist = await Playlist.findById(_id);

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, error: "No playlist found" });
    }
    if (playlist.user.toString() !== req.user.toString()) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized access is not allowed" });
    }
    let deletedPlaylist = await Playlist.findByIdAndDelete(_id);
    return res.status(200).json({
      success: true,
      message: "Playlist has been successfully deleted",
      deletedPlaylist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Some error occured",
    });
    console.log(err);
  }
});

module.exports = router;
