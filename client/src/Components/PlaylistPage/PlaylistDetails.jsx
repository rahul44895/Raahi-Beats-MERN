import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlaylistContext } from "../../Context/Playlist/PlaylistState";
import Cookie from "js-cookie";
import { IoIosPlayCircle } from "react-icons/io";
import SongCardMedium from "../Home/Sections/SongCardMedium";
import { AudioContext } from "../../Context/Audio/AudioState";

export default function PlaylistDetails() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { getPrivatePlaylist } = useContext(PlaylistContext);
  const { addPlaylistToQueue } = useContext(AudioContext);

  const { playlistID } = useParams();
  const [privatePlaylist, setPrivatePlaylist] = useState(null);

  const handlePrivatePlaylist = useCallback(
    async (playlistID) => {
      const response = await getPrivatePlaylist(playlistID);
      // console.log(response);
      if (response) setPrivatePlaylist(response[0]);
    },
    [getPrivatePlaylist]
  );

  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookie.get("user");
    if (!user) navigate("/login");
    if (!playlistID) navigate("/error");
    handlePrivatePlaylist(playlistID);
  }, [handlePrivatePlaylist, navigate, playlistID]);
  return (
    <div className="homeContainer">
      <div style={{ height: `${navbarHeight}px` }}></div>
      {privatePlaylist && (
        <div style={{ padding: "2em" }}>
          <div className="new-releases-header">
            <div className="new-releases-title">
              Tunu tunu meow meow
              <span
                className="song-card-medium-play-icon"
                onClick={() => addPlaylistToQueue(privatePlaylist.songs)}
              >
                <IoIosPlayCircle />
              </span>
            </div>
          </div>
          <div className="mainPagePlaylistContainer" style={{ gap: "10px" }}>
            {privatePlaylist ? (
              privatePlaylist.songs.map((currSong) => {
                return <SongCardMedium song={currSong} key={currSong._id} />;
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
