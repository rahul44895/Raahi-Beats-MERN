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

export default function FullScreen({setShowFullScreen}) {
  //useContext
  const { currSong } = useContext(AudioContext);
  const { handleshowPlaylistDialogue } = useContext(PlaylistContext);

  // //useState
  const [liked, setLiked] = useState(false);

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
                Artists:
                {currSong.artists
                  ? currSong.artists.map((e, index) => {
                      return (
                        <Link to={`/artists/${e._id}`} key={e._id} onClick={()=>{
                          setShowFullScreen(false)
                        }}>
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
