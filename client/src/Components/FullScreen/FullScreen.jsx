import React, { useRef, useEffect, useState, useContext } from "react";
import "./FullScreenStyle.css";
import Queue from "../Queue/Queue";
import { AudioContext } from "../../Context/Audio/AudioState";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdPlaylistAdd } from "react-icons/md";
import { PlaylistDialogueContext } from "../../Context/Playlist/PlaylistDialogueState";


export default function FullScreen() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { currSong } = useContext(AudioContext);
  const { setShowPlaylistDialogue , setaddSongToPlaylist} = useContext(PlaylistDialogueContext);
  const main = useRef(null);
  const [liked, setLiked] = useState(false);
  return (
    <div className="fullscreen-song-container" ref={main}>
      <div
        className="fullscreen-song-subcontainer"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/${currSong.coverImage})`,
          backgroundSize: "cover",
        }}
      >
        <div className="fullscreen-backdrop"></div>
        <div
          className="fullscreen-main-container"
          style={{
            height: `${main.current?.offsetHeight}px`,
          }}
        >
          <div className="fullscreen-songArea">
            <div className="flex-display">
              <div className="add-playlist-icon-container">
                <div
                  onClick={() => {setShowPlaylistDialogue(true); setaddSongToPlaylist(currSong)}}
                  className="tooltip"
                >
                  <MdPlaylistAdd />
                  <span className="tooltiptext">Add to Playlist</span>
                </div>
              </div>
              <div className="song-image-container">
                <img
                  src={`${process.env.PUBLIC_URL}/${currSong.coverImage}`}
                  className="song-image"
                  alt={currSong.title ? currSong.title : "Unknown Artist"}
                />
              </div>
              <div className="like-share-container">
                <div onClick={() => setLiked(!liked)} className="tooltip">
                  {liked ? <FaHeart /> : <FaRegHeart />}
                  <span className="tooltiptext">Like</span>
                </div>
                <div
                  onClick={() => alert("Under Development")}
                  className="tooltip"
                >
                  <FaShareFromSquare />
                  <span className="tooltiptext">Share</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="song-title">
                {currSong.title ? currSong.title : "Unknown title"}
              </h1>
              <p className="song-info">
                Artists: {currSong.artist ? currSong.artist : "Unknown artist"}
              </p>
              <p className="song-info">
                Album: {currSong.album ? currSong.album : "Unknown album"}
              </p>
              <p className="song-info">
                Released Year:{" "}
                {currSong.releaseDate ? currSong.releaseDate : "Unknown year"}
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
