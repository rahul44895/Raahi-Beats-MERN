import React, { useContext, useEffect, useState } from "react";
import { SongContext } from "../../Context/Songs/SongState";
import { AudioContext } from "../../Context/Audio/AudioState";
import SongCardXL from "../Home/Sections/SongCardXL";
import { IoIosPlayCircle } from "react-icons/io";
import bgVideo from "../../assets/video/likedSec1Landscape.mp4";
import bgVideoPortrait from "../../assets/video/likedSec1Portrait.mp4";

export default function LikedSongsPage() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { fetchLikedSongs } = useContext(SongContext);
  const { addPlaylistToQueue } = useContext(AudioContext);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const handleFetch = async () => {
      const response = await fetchLikedSongs();
      if (response) setResult(response);
    };
    handleFetch();
  }, [fetchLikedSongs]);

  return (
    <div
      style={{
        color: "white",
        overflowX: "hidden",
        overflowY: "auto",
        flex: "1 1",
        background: "black",
      }}
    >
      <div className="fullscreen-container ">
        <video
          src={window.innerWidth > 1000 ? bgVideo : bgVideoPortrait}
          muted
          autoPlay
          loop
          className="fullscreen-video"
          onError={() => alert("Some error occured")}
        ></video>

        <div className="video-overlay"></div>
      </div>
      <div style={{ height: `${navbarHeight}px`, width: "100%" }}></div>
      {result ? (
        <>
          {result.userLiked && (
            <div
              style={{
                padding: `2em ${window.innerWidth > 1000 ? "4em" : "0"}`,
              }}
            >
              {result?.userLiked?.length > 0 && (
                <div className="new-releases-header">
                  <div className="new-releases-title">
                    WE LOVE WHAT YOU LIKE !!
                    <span
                      className="song-card-medium-play-icon"
                      onClick={() => addPlaylistToQueue(result.userLiked)}
                    >
                      <IoIosPlayCircle />
                    </span>
                  </div>
                </div>
              )}
              <div className="new-releases-grid">
                {result.userLiked.map((currSong) => {
                  return <SongCardXL song={currSong} key={currSong._id} />;
                })}
              </div>
            </div>
          )}
          {result.songs && (
            <div
              style={{
                padding: `2em ${window.innerWidth > 1000 ? "4em" : "0"}`,
              }}
            >
              <div className="new-releases-header">
                <div className="new-releases-title">
                  Top 10 Liked Songs
                  <span
                    className="song-card-medium-play-icon"
                    onClick={() => addPlaylistToQueue(result.songs)}
                  >
                    <IoIosPlayCircle />
                  </span>
                </div>
              </div>
              <div className="new-releases-grid">
                {result.songs.map((currSong) => {
                  return <SongCardXL song={currSong} key={currSong._id} />;
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
