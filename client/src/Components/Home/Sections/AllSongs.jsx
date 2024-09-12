import React, { useContext, useState, useRef, useEffect } from "react";
import NewReleasesCard from "./SongCardXL";
import { SongContext } from "../../../Context/Songs/SongState";
import { AudioContext } from "../../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";

export default function AllSongs() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { fetchSongs } = useContext(SongContext);
  const [songList, setSongList] = useState(null);
  const { addPlaylistToQueue } = useContext(AudioContext);
  const main = useRef(null);
  const handleFetching = async () => {
    const response = await fetchSongs();
    setSongList(response);
  };
  useEffect(() => {
    handleFetching();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="homeContainer" ref={main}>
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
              {songList && (
                <span
                  className="song-card-medium-play-icon"
                  onClick={() => addPlaylistToQueue(songList)}
                >
                  <IoIosPlayCircle />
                </span>
              )}
            </div>
            <div>
              <div
                className="new-releases-see-more"
                onClick={() => {
                  alert("Pending...");
                }}
              >
                See More
              </div>

              <div
                className="new-releases-see-more"
                onClick={() => {
                  alert("Pending...");
                }}
              >
                See Less
              </div>
            </div>
          </div>
          <div className="new-releases-grid">
            {songList ? (
              songList.map((currSong) => {
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
