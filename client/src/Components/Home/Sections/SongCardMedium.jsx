import React, { useContext, useState } from "react";
import { IoIosPlayCircle } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdQueueMusic, MdOutlinePlaylistAdd } from "react-icons/md";
import "react-lazy-load-image-component/src/effects/blur.css";
import { AudioContext } from "../../../Context/Audio/AudioState";
import { PlaylistContext } from "../../../Context/Playlist/PlaylistState";
import { ShareContext } from "../../../Context/Share/ShareState";
import { SongContext } from "../../../Context/Songs/SongState";

export default function SongCardMedium({ song }) {
  const { play, addToQueue, playbtnAddToQueue } = useContext(AudioContext);
  const { handleshowPlaylistDialogue } = useContext(PlaylistContext);
  const { share } = useContext(ShareContext);
  const { updatePlayDetails } = useContext(SongContext);
  const [liked, setLiked] = useState(song.liked ? true : false);
  const host = process.env.REACT_APP_HOST;
  return (
    <div className="song-card-medium">
      <div>
        <LazyLoadImage
          src={`${host}/${song.coverImage}`}
          alt={song.title || "Unknown Title"}
          className="song-card-medium-image"
          effect="blur"
          wrapperProps={{
            style: { transitionDelay: "0.5s" },
          }}
        />
      </div>
      <div className="song-card-medium-overlay-text">
        {song.title && song.title.length > 20
          ? song.title.slice(0, 20) + "..."
          : song.title || "Unknown Title"}
      </div>
      <div className="song-card-medium-overlay">
        <div className="song-card-medium-overlay-controls">
          <span
            className="song-card-medium-play-icon"
            onClick={() => {
              play(song);
              playbtnAddToQueue(song);
            }}
          >
            <IoIosPlayCircle />
          </span>
          <span className="song-card-xl-upper-icons">
            <span
              onClick={() => {
                if (liked === false)
                  updatePlayDetails({ songID: song._id, likeCount: 1 });
                else updatePlayDetails({ songID: song._id, likeCount: -1 });
                setLiked(!liked);
              }}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </span>
            <span onClick={() => addToQueue(song)}>
              <MdQueueMusic />
            </span>
          </span>
          <span className="song-card-xl-lower-icons">
            <span
              onClick={() => {
                share(song);
              }}
            >
              <FaShareFromSquare />
            </span>
            <span onClick={() => handleshowPlaylistDialogue(song)}>
              <MdOutlinePlaylistAdd />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
