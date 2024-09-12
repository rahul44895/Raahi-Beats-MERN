import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlaylistContext } from "../../Context/Playlist/PlaylistState";
import "./PlaylistMainStyle.css";
import raahi_beats_logo from "../../assets/images/Apps/raahi-beats-logo.png";

export default function PlaylistMain() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { getPublicPlaylist, getPrivatePlaylist, handleshowPlaylistDialogue } =
    useContext(PlaylistContext);

  const [publicPlaylist, setPublicPlaylist] = useState(null);
  const [privatePlaylist, setPrivatePlaylist] = useState(null);

  const handlePublicPlaylist = useCallback(async () => {
    const response = await getPublicPlaylist();
    setPublicPlaylist(response);
  }, [getPublicPlaylist]);

  const handlePrivatePlaylist = useCallback(async () => {
    const response = await getPrivatePlaylist();
    setPrivatePlaylist(response);
  }, [getPrivatePlaylist]);
  useEffect(() => {
    handlePublicPlaylist();
  }, [handlePublicPlaylist]);

  useEffect(() => {
    handlePrivatePlaylist();
  }, [handlePrivatePlaylist]);

  return (
    <>
      <div className="homeContainer">
        <div style={{ height: `${navbarHeight}px`, width: "100%" }}></div>
        {privatePlaylist && (
          <div style={{ padding: "2em" }}>
            <div className="new-releases-header">
              <div className="new-releases-title">
                Playlists Curated By You
                <button
                  className="btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleshowPlaylistDialogue(null)}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mainPagePlaylistContainer">
              {privatePlaylist ? (
                privatePlaylist.map((currPlaylist) => {
                  return (
                    <Link
                      key={currPlaylist._id}
                      to={`/playlist/${currPlaylist._id}`}
                    >
                      {console.log(currPlaylist)}
                      <div
                        key={currPlaylist._id}
                        className="mainPagePlaylistItem"
                      >
                        <img
                          className="mainPagePlaylistImage"
                          src={raahi_beats_logo}
                          alt={currPlaylist.name}
                        />
                        <p>{currPlaylist.name}</p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        )}
        <div style={{ padding: "2em" }}>
          <div className="new-releases-header">
            <div className="new-releases-title">
              Playlists Curated For You
              {/* <span className="song-card-medium-play-icon">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm83.8 211.9l-137.2 83c-2.9 1.8-6.7-.4-6.7-3.9V173c0-3.5 3.7-5.7 6.7-3.9l137.2 83c2.9 1.7 2.9 6.1 0 7.8z"></path>
                </svg>
              </span> */}
            </div>
          </div>
          <div className="mainPagePlaylistContainer">
            {publicPlaylist ? (
              publicPlaylist.map((currPlaylist) => {
                return (
                  <Link
                    key={currPlaylist._id}
                    to={`/playlist/${currPlaylist._id}`}
                  >
                    <div className="mainPagePlaylistItem">
                      <img
                        className="mainPagePlaylistImage"
                        src={
                          currPlaylist.thumbnnail
                            ? currPlaylist.thumbnnail
                            : raahi_beats_logo
                        }
                        alt={currPlaylist.name}
                      />
                      <p>{currPlaylist.name}</p>
                    </div>
                  </Link>
                );
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
