import React, { useContext, useEffect, useState, useRef } from "react";
import NewReleasesCard from "./SongCardXL";
import { SongContext } from "../../../Context/Songs/SongState";
import { AudioContext } from "../../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";

export default function AllSongs({ range, navbarHeight }) {
  const { songList } = useContext(SongContext);
  const { addPlaylistToQueue } = useContext(AudioContext);
  const [visibility, setVisibility] = useState(true);
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
              ALL SONGS
              <span
                className="song-card-medium-play-icon"
                onClick={() => addPlaylistToQueue(songList)}
              >
                <IoIosPlayCircle />
              </span>
            </div>
            {/* <div>
              {visibility && (
                <div
                  className="new-releases-see-more"
                  onClick={() => {
                    setVisibility(!visibility);
                  }}
                >
                  See More
                </div>
              )}
              {!visibility && (
                <div
                  className="new-releases-see-more"
                  onClick={() => {
                    handleSongList(range);
                    setVisibility(!visibility);
                  }}
                >
                  See Less
                </div>
              )}
            </div> */}
          </div>
          <div className="new-releases-grid">
            {songList &&
              songList.map((currSong) => {
                return <NewReleasesCard song={currSong} key={currSong.id}/>;
              })}
          </div>
        </div>
      </div>
    </>
  );
}
