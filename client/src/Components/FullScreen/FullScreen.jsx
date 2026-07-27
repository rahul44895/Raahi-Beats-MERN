import React, { useState, useContext, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import "./FullScreenStyle.css";
import { MdLoop, MdPlaylistAdd } from "react-icons/md";
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
import { PiShuffleBold } from "react-icons/pi";
import Seekbar from "../ControlArea/Seekbar";
import useIsMobile from "../../hooks/useIsMobile";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LAZY_IMAGE_WRAPPER_PROPS = { style: { transitionDelay: "0.5s" } };
// Lazy so the drag-and-drop library it pulls in only loads once the queue area is shown.
const Queue = lazy(() => import("../Queue/Queue"));

export default function FullScreen({ setFullScreenVisible }) {
  const isMobile = useIsMobile();
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
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
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
          className="fullscreen-main-container scroll-container"
          style={{
            height: `100%`,
          }}
        >
          <div className="fullscreen-songArea scroll-item">
            <div className="song-image-container">
              <LazyLoadImage
                src={`${currSong?.coverImage}`}
                className="song-image"
                alt={currSong?.title ? currSong.title : "Unknown Title"}
                effect="blur"
                wrapperProps={LAZY_IMAGE_WRAPPER_PROPS}
              />
            </div>
            <div className="flex-display" style={{width:'35vh', marginTop:'15px'}}>
              <div
                onClick={() => handleshowPlaylistDialogue(currSong)}
                className="tooltip"
              >
                <MdPlaylistAdd />
                <span className="tooltiptext">Add to Playlist</span>
              </div>
              <div
                onClick={() => {
                  if (liked === false)
                    updatePlayDetails({
                      songID: currSong._id,
                      likeCount: 1,
                    });
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
            <div className="fullscreenInfoContainer">
              <h1 className="song-title">
                {currSong?.title ? currSong.title : "Unknown title"}
              </h1>
              <p className="song-info">
                Artists:
                {currSong?.artists
                  ? currSong.artists.map((e, index) => {
                      return (
                        <Link
                          to={`/artists/${e.shortenURL}`}
                          key={e._id}
                          onClick={() => setFullScreenVisible(false)}
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
                Album: {currSong?.album ? currSong.album : "Unknown album"}
              </p>
              <p className="song-info">
                Released Year:
                {currSong?.releaseDate
                  ? new Date(currSong.releaseDate).getFullYear()
                  : "Unknown year"}
              </p>
              {/* <p className="song-info">
                Duration:{" "}
                {currSong?.duration ? formatTime(currSong.duration) : "Unknown"}
              </p> */}
            </div>
            {isMobile && (
              <>
                <div className="seekbar-container">
                  <Seekbar formatTime={formatTime} split />
                </div>

                <div className="play-pause-icon">
                  {/* {loop === 0 && (
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
                      style={{ color: "#0075ff" }}
                      onClick={() => setLoop(0)}
                    >
                      <SlLoop size={30} />1
                    </span>
                  )} */}

                  {loop === 0 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={() => setLoop(2)}
                    >
                      <MdLoop size={30} />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                      </span>
                    </span>
                  )}
                  {loop === 2 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                        color: "red",
                      }}
                      onClick={() => setLoop(1)}
                    >
                      <MdLoop size={30} />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                      </span>
                    </span>
                  )}
                  {loop === 1 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                        color: "red",
                      }}
                      onClick={() => setLoop(0)}
                    >
                      <MdLoop size={30} />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        1
                      </span>
                    </span>
                  )}

                  <BiSolidSkipPreviousCircle size={30} onClick={previous} />

                  {!isPlaying && (
                    <IoIosPlayCircle size={50} onClick={() => playnpause()} />
                  )}
                  {isPlaying && (
                    <MdPauseCircle size={50} onClick={() => playnpause()} />
                  )}

                  <BiSolidSkipNextCircle size={30} onClick={() => next()} />

                  <PiShuffleBold size={30} onClick={shuffle} />
                </div>
              </>
            )}
          </div>

          <div className="fullscreen-queueArea scroll-item">
            <h1 className="queue-header">
              Queue
              {/* <span className="add-queue-icon">
                <MdPlaylistAdd />
              </span> */}
            </h1>
            <hr />
            <div className="queue-content">
              <Suspense fallback={<p>Loading...</p>}>
                <Queue />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
