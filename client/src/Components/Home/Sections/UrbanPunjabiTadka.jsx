import React, { useContext, useEffect, useRef, useState } from "react";
import { SongContext } from "../../../Context/Songs/SongState";
import { AudioContext } from "../../../Context/Audio/AudioState";
import { PlaylistContext } from "../../../Context/Playlist/PlaylistState";
import SongCardMedium from "./SongCardMedium";
import { IoIosPlayCircle } from "react-icons/io";

export default function UrbanPunjabiTadka({ range, navbarHeight }) {
  const { handlePunjabiFunc } = useContext(SongContext);
  const { addPlaylistToQueue } = useContext(AudioContext);
  const { getPublicPlaylist } = useContext(PlaylistContext);

  const [songList, setSongList] = useState(null);
  const handleSongList = async (range) => {
    const result = await getPublicPlaylist("66d8a419c231a442ebb2325c");
    setSongList(result[0].songs?.slice(0, range));
  };
  useEffect(() => {
    handleSongList(range);
    // eslint-disable-next-line
  }, [range, handlePunjabiFunc]);
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
              Urban Punjabi Tadka
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
