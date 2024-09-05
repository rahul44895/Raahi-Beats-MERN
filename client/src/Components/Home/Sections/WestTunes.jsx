import React, { useContext, useEffect, useRef, useState } from "react";

import { AudioContext } from "../../../Context/Audio/AudioState";
import SongCardMedium from "./SongCardMedium";
import { IoIosPlayCircle } from "react-icons/io";
import { PlaylistContext } from "../../../Context/Playlist/PlaylistState";

export default function WestTunes({ range, navbarHeight }) {
  const { getPublicPlaylist } = useContext(PlaylistContext);
  const { addPlaylistToQueue } = useContext(AudioContext);
  const [songList, setSongList] = useState(null);
  const handleSongList = async (range) => {
    const result = await getPublicPlaylist("66d8aff152ca27ed86ffa9bf");
    setSongList(result[0].songs?.slice(0, range));
  };
  useEffect(() => {
    handleSongList(range);
    // eslint-disable-next-line
  }, [range,setSongList]);
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
              West Tunes
              <span
                className="song-card-medium-play-icon"
                onClick={() => addPlaylistToQueue(songList)}
              >
                <IoIosPlayCircle />
              </span>
            </div>
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              {visibility && (
                <div
                  className="new-releases-see-more"
                  onClick={() => {
                    handleSongList(20);
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
            {songList ? (
              songList.map((currSong) => {
                return <SongCardMedium song={currSong} key={currSong._id} />;
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
