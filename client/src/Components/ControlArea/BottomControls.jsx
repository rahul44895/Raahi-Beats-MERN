import React, { useContext, useEffect, useRef, useState } from "react";
import "./BottomControlsStyle.css";
import { AudioContext } from "../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";
import { MdPauseCircle } from "react-icons/md";
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { RiFullscreenLine } from "react-icons/ri";
import {
  BiSolidSkipPreviousCircle,
  BiSolidSkipNextCircle,
} from "react-icons/bi";
import { SlLoop } from "react-icons/sl";
import { PiShuffleBold } from "react-icons/pi";
import Marquee from "react-fast-marquee";
import FullScreen from "../FullScreen/FullScreen";
import { SongContext } from "../../Context/Songs/SongState";
import { Link } from "react-router-dom";

export default function BottomControls() {
  const { setSongDetails } = useContext(SongContext);
  const {
    playnpause,
    stop,
    volumeChange,
    isPlaying,
    currTime,
    duration,
    handleSeek,
    audio,
    currSong,
    next,
    previous,
    loop,
    setLoop,
    shuffle,
  } = useContext(AudioContext);

  const [mute, setMute] = useState(false);

  const [volumeBar, setVolumeBar] = useState(100);

  const handleMuteToggle = () => {
    !mute ? volumeChange(0) : volumeChange(volumeBar);
    setMute(!mute);
  };

  const handleVolumeChange = (e) => {
    volumeChange(e.target.value);
    setVolumeBar(e.target.value);
    if (e.target.value === 0) setMute(true);
    else if (mute) setMute(false);
  };

  const formatTime = (ms) => {
    // console.log(ms);
    const totalSeconds = Math.floor(ms);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  const bottomSongInfoContainer = useRef(null);
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    audio && (
      <div
        style={{
          height: `${showFullScreen ? "100%" : ""}`,
          display: "flex",
          flexDirection: "column",
          overflow: `${showFullScreen ? "hidden" : "auto"}`,
        }}
      >
        {showFullScreen && <FullScreen />}

        <div className="bottom-controls">
          <div className="seekbar-container">
            <input
              max={duration}
              min={0}
              name="seekbar"
              type="range"
              style={{ flex: "2 1", cursor: "pointer" }}
              value={currTime}
              onChange={(e) => {
                handleSeek(e.target.value);
              }}
            />

            <span>
              {currTime ? formatTime(currTime) : "--"}/
              {duration ? formatTime(duration) : "--"}
            </span>
          </div>
          <div className="controls-container">
            <Link to={`/details/${currSong.title}`}>
              <div
                className="bottom-song-info-container"
                ref={bottomSongInfoContainer}
              >
                <img
                  src={currSong ? currSong.coverImage : ""}
                  className="bottom-song-image"
                  alt="song-image"
                />
                <div className="bottom-song-title">
                  {currSong.title ? currSong.title : "Unknown"}
                  <br />
                  {currSong && currSong.artist ? (
                    bottomSongInfoContainer.current ? (
                      bottomSongInfoContainer.current.scrollWidth >
                      bottomSongInfoContainer.current.clientWidth ? (
                        <Marquee>{currSong.artist}</Marquee>
                      ) : (
                        // currSong.artist
                        currSong.artist
                      )
                    ) : (
                      ""
                    )
                  ) : (
                    "--"
                  )}
                </div>
              </div>
            </Link>
            <div className="play-pause-icon">
              {loop == 0 && (
                <span style={{ fontSize: "2.5rem" }} onClick={() => setLoop(2)}>
                  <SlLoop />
                </span>
              )}
              {loop == 2 && (
                <span
                  style={{ fontSize: "2.5rem", color: "#0075ff" }}
                  onClick={() => setLoop(1)}
                >
                  <SlLoop />
                </span>
              )}
              {loop == 1 && (
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
            <div className="volume-controls">
              <div className="volume-container">
                <span
                  onClick={() => handleMuteToggle()}
                  className="volume-icon"
                >
                  {mute || volumeBar === 0 ? (
                    <FaVolumeXmark />
                  ) : volumeBar >= 66 ? (
                    <FaVolumeHigh />
                  ) : volumeBar <= 33 ? (
                    <FaVolumeLow />
                  ) : (
                    <IoVolumeMediumSharp />
                  )}
                </span>

                <input
                  type="range"
                  name="volumeBar"
                  max={100}
                  min={0}
                  value={volumeBar}
                  onChange={(e) => {
                    handleVolumeChange(e);
                  }}
                />

                <span
                  onClick={() => {
                    setShowFullScreen(!showFullScreen);
                    setSongDetails(currSong);
                  }}
                >
                  <RiFullscreenLine />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
