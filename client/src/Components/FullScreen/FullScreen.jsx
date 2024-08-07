import React, { useRef, useEffect, useState, useContext } from "react";
import "./FullScreenStyle.css";
import Queue from "../Queue/Queue";
import { AudioContext } from "../../Context/Audio/AudioState";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

export default function FullScreen() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { currSong } = useContext(AudioContext);
  const main = useRef(null);
  return (
    <div className="fullscreen-song-container" ref={main}>
      <div
        className="fullscreen-song-subcontainer"
        style={{
          background: `url(${process.env.PUBLIC_URL}/${currSong.coverImage})`,
          backgroundSize: "cover",
        }}
      >
        <div className="fullscreen-backdrop"></div>
        <div
          className="fullscreen-main-container"
          style={{
            height: `${main.current?.offsetHeight}px`,
            // height: `calc(${main.current?.offsetHeight}px - ${0}px)`,
          }}
        >
          <div className="fullscreen-songArea">
            <div className="song-image-container">
              <img
                src={`${process.env.PUBLIC_URL}/${currSong.coverImage}`}
                className="song-image"
              />
            </div>
            <div>
              <h1 style={{ textAlign: "center", marginBottom: "5px" }}>
                {currSong.title ? currSong.title : "Unknown title"}
              </h1>
              <p style={{ fontSize: "1rem", marginBottom: "5px" }}>
                Artists: {currSong.artist ? currSong.artist : "Unknown artist"}
              </p>
              <p style={{ fontSize: "1rem", marginBottom: "5px" }}>
                Album: {currSong.album? currSong.album : "Unknown album"}
              </p>
              <p style={{ fontSize: "1rem", marginBottom: "5px" }}>
                Released Year: {currSong.releaseDate ? currSong.releaseDate : "Unknown year"}
              </p>
              <p style={{ fontSize: "3rem", marginBottom: "5px" }}>
                Like Icon
                <br />
                Share Icon
                <br />
                Add To Personal Playlist
                <br />
                Add To Current Playing QUEUE
                <br />
              </p>
              <div
                style={{
                  width: "300px",
                  height: "20px",
                  background: "#ff8a8a",
                  border: "2px solid white",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    background: "red",
                    borderRadius: "10px",
                    overflow: "hidden",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AiFillLike /> 60%
                </div>
                <div
                  style={{
                    width: "40%",
                    borderRadius: "10px",
                    overflow: "hidden",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AiFillDislike /> 40%
                </div>
              </div>
            </div>
          </div>
          <div className="fullscreen-queueArea">
            <h1 style={{ padding: "1em" }}>Queue (SAVE AS PLAYLIST)</h1>
            <hr />
            <div style={{ overflow: "auto" }}>
              <Queue />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
