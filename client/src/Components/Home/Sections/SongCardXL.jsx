import React, { useContext, useState } from "react";
import { AudioContext } from "../../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdQueueMusic } from "react-icons/md";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function SongCardXL({ song }) {
  const { play, addToQueue, playbtnAddToQueue } = useContext(AudioContext);
  const [liked, setLiked] = useState(false);
  return (
    <div className="song-card-xl">
      <LazyLoadImage
        src={song.coverImage}
        alt={song.title || "Unknown Title"}
        className="song-card-xl-image"
        effect="blur"
        wrapperProps={{
          style: { transitionDelay: "0.5s" },
        }}
      />
      <div className="song-card-xl-overlay">
        <div className="song-card-xl-overlay-text">
          {song.title || "Unknown Title"}
        </div>
        <div className="song-card-xl-overlay-controls">
          <span
            className="song-card-xl-play-icon"
            onClick={() => {
              play(song);
              playbtnAddToQueue(song);
              // setQueue((prevState) => [...prevState, song]);
            }}
          >
            <IoIosPlayCircle />
          </span>
          <span className="song-card-xl-upper-icons">
            <span onClick={() => setLiked(!liked)}>
              {liked ? <FaHeart /> : <FaRegHeart />}
            </span>
            <span onClick={() => addToQueue(song)}>
              <MdQueueMusic />
            </span>
          </span>
          <span className="song-card-xl-lower-icons">
            <span onClick={() => alert("Under Development")}>
              <FaShareFromSquare />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
