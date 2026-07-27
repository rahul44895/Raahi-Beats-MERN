import React, { useContext, useEffect, useState } from "react";
import { AudioContext } from "../../Context/Audio/AudioState";
import useDominantColor, {
  getArtworkThemeStyle,
} from "../../hooks/useDominantColor";

const POLL_INTERVAL_MS = 200;

export default function Seekbar({
  formatTime,
  split = false,
  adaptToArtwork = false,
}) {
  const { audio, duration, handleSeek, currSong } = useContext(AudioContext);
  const [currentTime, setCurrentTime] = useState(audio ? audio.currentTime : 0);
  // Gate the argument, not the hook call, so this always runs unconditionally.
  const dominantColor = useDominantColor(
    adaptToArtwork ? currSong?.coverImage : null
  );

  useEffect(() => {
    setCurrentTime(audio ? audio.currentTime : 0);

    if (!audio) return;

    let intervalId = null;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const startInterval = () => {
      if (!intervalId) intervalId = setInterval(updateTime, POLL_INTERVAL_MS);
    };
    const clearExistingInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    if (!audio.paused) startInterval();
    audio.addEventListener("play", startInterval);
    audio.addEventListener("pause", clearExistingInterval);

    return () => {
      audio.removeEventListener("play", startInterval);
      audio.removeEventListener("pause", clearExistingInterval);
      clearExistingInterval();
    };
  }, [audio]);

  if (!audio) return null;

  const seekPercent = duration.current
    ? Math.min(
        100,
        Math.max(0, Math.floor((currentTime * 100) / duration.current))
      )
    : 0;

  const handleChange = (e) => {
    const newTime = (e.target.value * duration.current) / 100;
    handleSeek(newTime);
    setCurrentTime(newTime);
  };

  const artworkThemeStyle = adaptToArtwork
    ? getArtworkThemeStyle(dominantColor)
    : undefined;

  const input = (
    <input
      type="range"
      name="volumeBar"
      max={100}
      min={0}
      value={seekPercent}
      onChange={handleChange}
      style={{
        height: "5px",
        backgroundColor: "#efefef",
        width: "100%",
        ...artworkThemeStyle,
      }}
    />
  );

  if (split) {
    return (
      <>
        <span>{formatTime(currentTime)}</span>
        {input}
        <span>{formatTime(duration.current)}</span>
      </>
    );
  }

  return (
    <>
      {input}
      <span>
        {formatTime(currentTime)}/{formatTime(duration.current)}
      </span>
    </>
  );
}
