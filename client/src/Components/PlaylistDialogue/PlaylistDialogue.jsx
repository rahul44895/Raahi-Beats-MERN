import React, { useContext, useEffect, useRef, useState } from "react";
import "./PlaylistDialogueStyle.css";
import { PlaylistContext } from "../../Context/Playlist/PlaylistState";
import PlaylistDialogueSection2 from "./PlaylistDialogueSection2";
import { IoMdAdd, IoMdClose } from "react-icons/io";

export default function PlaylistDialogue() {
  const {
    showPlaylistDialogue,
    setshowPlaylistDialogue,
    playlist,
    getallPlaylist,
    getPlaylistDetails,
    addToPlaylistFunc,
    updatePlaylistOrderFunc,
    updatePlaylistDetailsFunc,
    deletePlaylist,
    createPlaylist,
    deleteSongFromPlaylist,
  } = useContext(PlaylistContext);
  const [currPlaylist, setCurrPlaylist] = useState(null);
  const [PlaylistSec1, setPlaylistSec1] = useState(true);
  const [PlaylistSec2, setPlaylistSec2] = useState(false);
  const [showCreatePlaylistForm, setshowCreatePlaylistForm] = useState(false);

  useEffect(() => {
    if (showPlaylistDialogue) getallPlaylist({ user: true });
  }, [showPlaylistDialogue,getallPlaylist]);

  const handlePlaylist = async (currPlaylist) => {
    const playlistDetails = await getPlaylistDetails(currPlaylist);
    // console.log(playlistDetails);
    setCurrPlaylist(playlistDetails);
    setPlaylistSec2(true);
    setPlaylistSec1(false);
  };
  const PlaylistDialogueRef = useRef(null);

  const [playlistDetails, setplaylistDetails] = useState({
    name: "",
    public: false,
    description: "",
  });
  const onChange = (e) => {
    setplaylistDetails({
      ...playlistDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const response = await createPlaylist(playlistDetails);
    if (response) setplaylistDetails({ name: "", public: "", description: "" });
  };

  return (
    <>
      {showPlaylistDialogue && (
        <div className="playlist-dialogue" ref={PlaylistDialogueRef}>
          {PlaylistSec1 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1em",
                }}
              >
                <h1>Playlist</h1>
                <span
                  onClick={() => {
                    PlaylistDialogueRef.current.classList.add(
                      "playlist-dialogue-exit"
                    );
                    setTimeout(() => {
                      setshowPlaylistDialogue(false);
                    }, 180);
                  }}
                >
                  <IoMdClose />
                </span>
              </div>
              <hr />
              <div>
                {!showCreatePlaylistForm ? (
                  <button
                    className="btn"
                    style={{ width: "100%" }}
                    onClick={() => setshowCreatePlaylistForm(true)}
                  >
                    Create Playlist
                  </button>
                ) : (
                  <button
                    className="btn"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => setshowCreatePlaylistForm(false)}
                  >
                    <IoMdClose /> Cancel
                  </button>
                )}
                {showCreatePlaylistForm && (
                  <>
                    <div>
                      <div>
                        <input
                          value={playlistDetails.name}
                          placeholder="Playlist Name"
                          name="name"
                          onChange={onChange}
                        />
                        <br />
                        <span style={{ color: "green" }}>
                          Playlist should be public
                          <br />
                          <input
                            value={playlistDetails.public}
                            list="public"
                            name="public"
                            onChange={onChange}
                          />
                          <datalist id="public">
                            <option value={true} />
                            <option value={false} />
                          </datalist>
                        </span>
                      </div>
                      <textarea
                        placeholder="playlist description"
                        value={playlistDetails.description}
                        onChange={onChange}
                        name="description"
                      ></textarea>
                    </div>
                    <button className="btn" onClick={() => handleSubmit()}>
                      Save
                    </button>
                  </>
                )}
              </div>
              <div>
                {playlist &&
                  playlist.map((currPlaylist) => {
                    return (
                      <div key={currPlaylist._id} className="playlistItem">
                        <div
                          onClick={() => handlePlaylist(currPlaylist)}
                          className="playlistItemText"
                        >
                          {currPlaylist.name}
                        </div>
                        <div
                          className="playlistItemAddBtn"
                          onClick={() => addToPlaylistFunc(currPlaylist._id)}
                        >
                          <span>
                            <IoMdAdd />
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
          {PlaylistSec2 && (
            <PlaylistDialogueSection2
              currPlaylist={currPlaylist}
              setCurrPlaylist={setCurrPlaylist}
              setPlaylistSec1={setPlaylistSec1}
              setPlaylistSec2={setPlaylistSec2}
              updatePlaylistOrderFunc={updatePlaylistOrderFunc}
              updatePlaylistDetailsFunc={updatePlaylistDetailsFunc}
              deletePlaylist={deletePlaylist}
              deleteSongFromPlaylist={deleteSongFromPlaylist}
            />
          )}
        </div>
      )}
    </>
  );
}
