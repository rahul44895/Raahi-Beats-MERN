import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./FullScreenStyle.css";
import Queue from "../Queue/Queue";
import { MdPlaylistAdd } from "react-icons/md";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { AudioContext } from "../../Context/Audio/AudioState";
import { PlaylistContext } from "../../Context/Playlist/PlaylistState";
import { ShareContext } from "../../Context/Share/ShareState";
import { SongContext } from "../../Context/Songs/SongState";
import { MdPauseCircle } from "react-icons/md";
import {
  BiSolidSkipPreviousCircle,
  BiSolidSkipNextCircle,
} from "react-icons/bi";
import { IoIosPlayCircle } from "react-icons/io";
import { SlLoop } from "react-icons/sl";
import { PiShuffleBold } from "react-icons/pi";

export default function FullScreen({ setShowFullScreen }) {
  //useContext
  const { handleshowPlaylistDialogue } = useContext(PlaylistContext);
  const { share } = useContext(ShareContext);
  const { updatePlayDetails } = useContext(SongContext);
  const {
    playnpause,
    isPlaying,
    currSong,
    next,
    previous,
    loop,
    setLoop,
    shuffle,
  } = useContext(AudioContext);

  // //useState
  const [liked, setLiked] = useState(currSong && currSong.liked ? true : false);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="fullscreen-song-container">
      <div
        className="fullscreen-song-subcontainer"
        style={{
          backgroundImage: `url(${currSong.coverImage})`,
          backgroundSize: "cover",
        }}
      >
        <div className="fullscreen-backdrop"></div>
        <div
          className="fullscreen-main-container"
          style={{
            height: `100%`,
          }}
        >
          <div className="fullscreen-songArea">
            <div className="flex-display">
              <div className="add-playlist-icon-container">
                <div
                  onClick={() => handleshowPlaylistDialogue(currSong)}
                  className="tooltip"
                >
                  <MdPlaylistAdd />
                  <span className="tooltiptext">Add to Playlist</span>
                </div>
              </div>
              <div className="song-image-container">
                <img
                  src={`${currSong.coverImage}`}
                  className="song-image"
                  alt={currSong.title ? currSong.title : "Unknown Artist"}
                />
              </div>
              <div className="like-share-container">
                <div
                  onClick={() => {
                    if (liked === false)
                      updatePlayDetails({ songID: currSong._id, likeCount: 1 });
                    else
                      updatePlayDetails({
                        songID: currSong._id,
                        likeCount: -1,
                      });
                    setLiked(!liked);
                  }}
                  className="tooltip"
                >
                  {liked ? <FaHeart /> : <FaRegHeart />}
                  <span className="tooltiptext">Like</span>
                </div>
                <div onClick={() => share(currSong)} className="tooltip">
                  <FaShareFromSquare />
                  <span className="tooltiptext">Share</span>
                </div>
              </div>
            </div>
            <div className="fullscreenInfoContainer">
              <h1 className="song-title">
                {currSong.title ? currSong.title : "Unknown title"}
              </h1>
              <p className="song-info">
                Artists:
                {currSong.artists
                  ? currSong.artists.map((e, index) => {
                      return (
                        <Link
                          to={`/artists/${e.shortenURL}`}
                          key={e._id}
                          onClick={() => {
                            setShowFullScreen(false);
                          }}
                        >
                          <span>
                            {e.name}
                            {index !== currSong.artists.length - 1 ? ", " : ""}
                          </span>
                        </Link>
                      );
                    })
                  : "Unknown artist"}
              </p>
              <p className="song-info">
                Album: {currSong.album ? currSong.album : "Unknown album"}
              </p>
              <p className="song-info">
                Released Year:
                {currSong.releaseDate
                  ? new Date(currSong.releaseDate).getFullYear()
                  : "Unknown year"}
              </p>
              <p className="song-info">
                Duration:{" "}
                {currSong.duration ? formatTime(currSong.duration) : "Unknown"}
              </p>

              <div className="like-dislike-bar">
                <div className="like-bar">
                  <AiFillLike /> 60%
                </div>
                <div className="dislike-bar">
                  <AiFillDislike /> 40%
                </div>
              </div>
            </div>
            {window.innerWidth < 1000 && (
              <div className="play-pause-icon">
                {loop === 0 && (
                  <span
                    style={{ fontSize: "2.5rem" }}
                    onClick={() => setLoop(2)}
                  >
                    <SlLoop />
                  </span>
                )}
                {loop === 2 && (
                  <span
                    style={{ fontSize: "2.5rem", color: "#0075ff" }}
                    onClick={() => setLoop(1)}
                  >
                    <SlLoop />
                  </span>
                )}
                {loop === 1 && (
                  <span
                    style={{ fontSize: "2.5rem", color: "#0075ff" }}
                    onClick={() => setLoop(0)}
                  >
                    <SlLoop />1
                  </span>
                )}

                <span style={{ fontSize: "2.5rem" }} onClick={previous}>
                  <BiSolidSkipPreviousCircle />
                </span>
                <span onClick={() => playnpause()}>
                  {!isPlaying && <IoIosPlayCircle />}
                  {isPlaying && <MdPauseCircle />}
                </span>
                <span style={{ fontSize: "2.5rem" }} onClick={() => next()}>
                  <BiSolidSkipNextCircle />
                </span>
                <span style={{ fontSize: "2.5rem" }} onClick={shuffle}>
                  <PiShuffleBold />
                </span>
              </div>
            )}
          </div>
          <div className="fullscreen-queueArea">
            <h1 className="queue-header">
              Queue
              <span className="add-queue-icon">
                <MdPlaylistAdd />
              </span>
            </h1>
            <hr />
            <div className="queue-content">
              <Queue />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
