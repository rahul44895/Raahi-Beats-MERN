import React, { useContext, useEffect, useRef, useState } from "react";
import "./BottomControlsStyle.css";
import { AudioContext } from "../../Context/Audio/AudioState";
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { RiFullscreenLine } from "react-icons/ri";
import { MdPauseCircle } from "react-icons/md";
import {
  BiSolidSkipPreviousCircle,
  BiSolidSkipNextCircle,
} from "react-icons/bi";
import { IoIosPlayCircle } from "react-icons/io";
import { SlLoop } from "react-icons/sl";
import { PiShuffleBold } from "react-icons/pi";
import Marquee from "react-fast-marquee";
import { SongContext } from "../../Context/Songs/SongState";
import { Link } from "react-router-dom";
import Seekbar from "./Seekbar";

export default function BottomControls({
  isFullScreenVisible,
  setFullScreenVisible,
}) {
  const { setSongDetails } = useContext(SongContext);
  const {
    playnpause,
    volumeChange,
    isPlaying,
    currTime,
    duration,
    audio,
    handleSeek,
    currSong,
    next,
    previous,
    loop,
    setLoop,
    shuffle,
  } = useContext(AudioContext);
  const [currentTime, setcurrentTime] = useState(currTime.current);
  const minWindowWidth = 1000;
  useEffect(() => {
    let intervalId;

    const updateTime = () => {
      setcurrentTime(currTime.current);
    };

    const startInterval = () => {
      if (!intervalId) {
        intervalId = setInterval(updateTime, 1000);
      }
    };

    const clearExistingInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    if (audio) {
      // Start the interval if the audio is already playing
      if (!audio.paused) {
        startInterval();
      }

      // Add event listeners to handle play and pause
      audio.addEventListener("play", startInterval);
      audio.addEventListener("pause", clearExistingInterval);
    }

    return () => {
      // Clean up event listeners and interval on unmount or when audio changes
      if (audio) {
        audio.removeEventListener("play", startInterval);
        audio.removeEventListener("pause", clearExistingInterval);
      }
      clearExistingInterval();
    };
  }, [audio, currTime]);

  const [mute, setMute] = useState(false);

  const [volumeBar, setVolumeBar] = useState(100);
  const bottomSongInfoContainer = useRef(null);

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
    const totalSeconds = Math.floor(ms);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    const handlePopState = () => {
      setFullScreenVisible(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setFullScreenVisible]);

  const handleFullScreenButton = () => {
    if (isFullScreenVisible === false)
      window.history.pushState(null, "", "");
    setFullScreenVisible(!isFullScreenVisible);
  };

  return (
    audio &&
    (window.innerWidth < 1000 ? !isFullScreenVisible : true) && (
      <div className="bottom-controls">
        <div className="seekbar-container">
          <Seekbar
            currentTime={currentTime}
            duration={duration}
            handleSeek={handleSeek}
          />
          <span>
            {currentTime ? formatTime(currentTime) : "00:00:00"}/
            {duration ? formatTime(duration.current) : "00:00:00"}
          </span>
        </div>
        <div className="controls-container">
          <Link
            to={
              window.innerWidth > minWindowWidth
                ? `/song/${currSong?.shortenURL}`
                : window.location
            }
          >
            <div
              className="bottom-song-info-container"
              ref={bottomSongInfoContainer}
              onClick={
                window.innerWidth < minWindowWidth
                  ? () => {
                      setSongDetails(currSong);
                      handleFullScreenButton();
                      // setFullScreenVisible(!isFullScreenVisible);
                    }
                  : () => {}
              }
            >
              <img
                src={currSong ? currSong.coverImage : ""}
                className="bottom-song-image"
                alt="song-image"
              />
              <div className="bottom-song-title">
                {currSong?.title ? currSong.title : "Unknown"}
                <br />
                {currSong && currSong.artists ? (
                  bottomSongInfoContainer.current ? (
                    bottomSongInfoContainer.current.scrollWidth >
                    bottomSongInfoContainer.current.clientWidth ? (
                      <Marquee>
                        {currSong.artists.map((artist, index) => (
                          <span style={{ marginRight: "3px" }} key={artist._id}>
                            {artist.name}
                            {index !== currSong.artists.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </Marquee>
                    ) : (
                      currSong.artists.map((artist, index) => {
                        return (
                          <span style={{ marginRight: "3px" }} key={artist._id}>
                            {artist.name}
                            {index !== currSong.artists.length - 1 ? ", " : ""}
                          </span>
                        );
                      })
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
            {window.innerWidth > minWindowWidth && (
              <>
                {" "}
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
              </>
            )}
            <span
              onClick={() => playnpause()}
              style={
                window.innerWidth < minWindowWidth
                  ? {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
                  : {}
              }
            >
              {!isPlaying ? <IoIosPlayCircle /> : <MdPauseCircle />}
            </span>
            {window.innerWidth > minWindowWidth && (
              <>
                <span style={{ fontSize: "2.5rem" }} onClick={() => next()}>
                  <BiSolidSkipNextCircle />
                </span>
                <span style={{ fontSize: "2.5rem" }} onClick={shuffle}>
                  <PiShuffleBold />
                </span>
              </>
            )}
          </div>
          {window.innerWidth > minWindowWidth && (
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
                    setSongDetails(currSong);
                    handleFullScreenButton();
                  }}
                >
                  <RiFullscreenLine />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
