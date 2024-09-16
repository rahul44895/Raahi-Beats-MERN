// Core Node.js modules
const fs = require("fs");

// Third-party modules
const express = require("express");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const shortid = require("shortid");

// Application-specific modules
const router = express.Router();
const SongsSchema = require("../models/SongSchema");
const upload = require("../middlewares/multer");
const deleteFiles = require("../Utils/DeleteFile");
const ArtistSchema = require("../models/ArtistSchema");
const UserSchema = require("../models/UserSchema");

// Environment variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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
      const uniqueID = shortid.generate();
      const shortenURL = `${title
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "-")}/${uniqueID}`;

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
        shortenURL,
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
            const artistuniqueID = shortid.generate();
            let artistshortenURL = `${artist.name.replace(
              /[^a-zA-Z0-9]/g,
              "-"
            )}/${artistuniqueID}`;
            artist = new ArtistSchema({
              name: currArtist.name.trim(),
              avatar: "undefined",
              shortenURL: artistshortenURL,
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
        { shortenURL: search },
      ],
    };
  }

  songs = await SongsSchema.find({ ...searchQuery }).sort({ title: 1 });

  let tempArr = JSON.parse(JSON.stringify(songs));
  if (req.body.userToken) {
    const token = JWT.verify(req.body.userToken, JWT_SECRET_KEY);
    const user = await UserSchema.findById(token.userID);
    const userFavourites = user.favourites;
    for (let currSong of tempArr) {
      const check = userFavourites.some(
        (favourite) =>
          favourite._id.equals(currSong._id) && favourite.category === "Song"
      );
      if (check) {
        currSong.liked = true;
      }
    }
  }
  for (const currSong of tempArr) {
    currSong.artists = await Promise.all(
      currSong.artists.map(async (currArtist) => {
        let temp = await ArtistSchema.findById(currArtist._id);
        return temp;
      })
    );
  }

  res.status(200).json({ success: true, total: songs.length, songs: tempArr });
});

// GET route to fetch new release songs
router.post("/get/newrelease", async (req, res) => {
  try {
    const contentsPerPage = 10;
    const songs = await SongsSchema.find()
      .sort({ releaseDate: -1 })
      .limit(contentsPerPage);
    const total = songs.length;

    let tempArr = JSON.parse(JSON.stringify(songs));
    if (req.body.userToken) {
      const token = JWT.verify(req.body.userToken, JWT_SECRET_KEY);
      const user = await UserSchema.findById(token.userID);
      const userFavourites = user.favourites;
      for (let currSong of tempArr) {
        const check = userFavourites.some(
          (favourite) =>
            favourite._id.equals(currSong._id) && favourite.category === "Song"
        );
        if (check) {
          currSong.liked = true;
        }
      }
    }
    for (const currSong of tempArr) {
      currSong.artists = await Promise.all(
        currSong.artists.map(async (currArtist) => {
          let temp = await ArtistSchema.findById(currArtist._id);
          return temp;
        })
      );
    }
    res.status(200).json({ total, songs: tempArr });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while fetching songs",
    });
  }
});

// GET route to fetch old songs
router.post("/get/oldsongs", async (req, res) => {
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

    let tempArr = JSON.parse(JSON.stringify(songs));
    if (req.body.userToken) {
      const token = JWT.verify(req.body.userToken, JWT_SECRET_KEY);
      const user = await UserSchema.findById(token.userID);
      const userFavourites = user.favourites;
      for (let currSong of tempArr) {
        const check = userFavourites.some(
          (favourite) =>
            favourite._id.equals(currSong._id) && favourite.category === "Song"
        );
        if (check) {
          currSong.liked = true;
        }
      }
    }
    for (const currSong of tempArr) {
      currSong.artists = await Promise.all(
        currSong.artists.map(async (currArtist) => {
          let temp = await ArtistSchema.findById(currArtist._id);
          return temp;
        })
      );
    }
    res.status(200).json({ total, songs: tempArr });
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

router.post("/likedSongs", async (req, res) => {
  try {
    let result = {};
    let songs = await SongsSchema.aggregate([
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$playCount", 0.4] },
              { $multiply: ["$likes", 0.6] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
    ]).sort({ title: 1 });

    let tempArr = JSON.parse(JSON.stringify(songs));
    if (req.body.userToken) {
      const token = JWT.verify(req.body.userToken, JWT_SECRET_KEY);
      const user = await UserSchema.findById(token.userID);
      const userFavourites = user.favourites;
      for (let currSong of tempArr) {
        const check = userFavourites.some(
          (favourite) =>
            favourite._id.equals(currSong._id) && favourite.category === "Song"
        );
        if (check) {
          currSong.liked = true;
        }
      }
    }
    for (const currSong of tempArr) {
      currSong.artists = await Promise.all(
        currSong.artists.map(async (currArtist) => {
          let temp = await ArtistSchema.findById(currArtist._id);
          return temp;
        })
      );
    }
    result.songs = tempArr;

    // SONGS LIKED BY PARTICULAR USER
    if (req.body.userToken) {
      const token = JWT.verify(req.body.userToken, JWT_SECRET_KEY);
      const user = await UserSchema.findById(token.userID);
      const userFavourites = user.favourites;

      const userLikedSongs = await SongsSchema.find({
        _id: { $in: userFavourites.map((fav) => fav._id) },
      }).sort({ title: 1 });
      let tempArr = JSON.parse(JSON.stringify(userLikedSongs));
      for (let currSong of tempArr) {
        currSong.liked = true;
      }
      for (const currSong of tempArr) {
        currSong.artists = await Promise.all(
          currSong.artists.map(async (currArtist) => {
            let temp = await ArtistSchema.findById(currArtist._id);
            return temp;
          })
        );
      }

      result.userLiked = tempArr;
    }
    res.status(200).json({
      success: true,
      message: "All liked songs are as follows.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//update play count and likes of the songs and artists
router.put("/update/playnlikes", async (req, res) => {
  try {
    const { songID, user, playCount, likeCount } = req.body;
    if (!songID) {
      return res
        .status(400)
        .json({ success: false, error: "Song ID is required" });
    }

    const song = await SongsSchema.findById(songID);
    if (!song) {
      return res.status(400).json({ success: false, error: "Song not found" });
    }
    if (playCount) song.playCount += 1;
    if (likeCount && !user) {
      return res
        .status(400)
        .json({ success: false, error: "You need to login to like a song." });
    }
    for (let currArtist of song.artists) {
      const artist = await ArtistSchema.findById(currArtist._id);
      if (playCount) artist.playedCount += 1;
      if (likeCount) artist.likedCount += Number(likeCount);
      await artist.save();
    }

    if (user) {
      const token = JWT.verify(user, JWT_SECRET_KEY);
      const exisitingUser = await UserSchema.findById(token.userID);
      if (exisitingUser) {
        if (playCount) {
          exisitingUser.plays += 1;
        }
        if (likeCount === 1) {
          song.likes += Number(likeCount);
          const check = exisitingUser.favourites.some(
            (favourite) =>
              favourite._id.equals(song._id) && favourite.category === "Song"
          );

          if (!check) {
            exisitingUser.favourites.push({
              _id: song._id,
              category: "Song",
            });
          }
        } else if (likeCount === -1) {
          song.likes += Number(likeCount);
          exisitingUser.favourites = exisitingUser.favourites.filter((curr) => {
            return curr._id.toString() !== song._id.toString();
          });
        }
        await exisitingUser.save();
      }
    }
    await song.save();
    res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
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

//update song duration
router.put("/update", async (req, res) => {
  // allSongs();
  try {
    const { _id, details } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ success: false, error: "Song id is required." });
    }
    if (!details) {
      return res.status(400).json({
        success: false,
        error: "Song details to be updated are required.",
      });
    }
    const { duration } = details;
    const updateDetails = {};
    if (duration) updateDetails.duration = duration;

    const updatedSong = await SongsSchema.findByIdAndUpdate(
      _id,
      { $set: updateDetails },
      { new: true }
    );
    if (!updatedSong) {
      return res.status(404).json({ success: false, error: "Song not found." });
    }
    return res.status(200).json({
      success: true,
      message: "Song updated successfully.",
      song: updatedSong,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal error occured" });
  }
});

const allSongs = async () => {
  const songs = await SongsSchema.find();
  const totalDuration = songs.reduce(
    (acc, song) => acc + (song.duration ? song.duration : 0),
    0
  );
  console.log({ totalDuration });
};

module.exports = router;
