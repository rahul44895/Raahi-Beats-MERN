import React, { useContext, useEffect, useState, useRef } from "react";
import NewReleasesCard from "./SongCardXL";
import { SongContext } from "../../../Context/Songs/SongState";
import { AudioContext } from "../../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";

export default function New_Releases({ navbarHeight }) {
  const { newReleaseFunc } = useContext(SongContext);
  const { addPlaylistToQueue } = useContext(AudioContext);
  const [newRelease, setNewRelease] = useState(null);
  const handleSongList = async () => {
    const result = await newReleaseFunc();
    if (result) setNewRelease(result);
  };

  useEffect(() => {
    handleSongList();
    // eslint-disable-next-line
  }, []);
  // const [visibility, setVisibility] = useState(true);
  const main = useRef(null);
  return (
    <>
      <div className="h-100vh-min scroll-item" ref={main}>
        <div style={{ height: `${navbarHeight}px`, width: "100vw" }}></div>

        <div
          className="new-releases-container"
          style={{
            height: `calc(${main.current?.offsetHeight}px - ${navbarHeight}px)`,
          }}
        >
          <div className="new-releases-header">
            <div className="new-releases-title">
              NEW RELEASES
              <span
                className="song-card-medium-play-icon"
                onClick={() => addPlaylistToQueue(newRelease)}
              >
                <IoIosPlayCircle />
              </span>
            </div>
          </div>
          <div className="new-releases-grid">
            {newRelease ? (
              newRelease.map((currSong) => {
                return <NewReleasesCard song={currSong} key={currSong._id} />;
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
