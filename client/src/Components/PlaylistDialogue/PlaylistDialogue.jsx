import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./PlaylistDialogueStyle.css";
import { PlaylistContext } from "../../Context/Playlist/PlaylistState";
import CurrPlaylist from "./CurrPlaylist";
import { IoMdAdd, IoMdClose } from "react-icons/io";

export default function PlaylistDialogue() {
  const {
    showPlaylistDialogue,
    setshowPlaylistDialogue,
    getPrivatePlaylist,
    addToPlaylistFunc,
    updatePlaylistOrderFunc,
    updatePlaylistDetailsFunc,
    deletePlaylist,
    createPlaylist,
    deleteSongFromPlaylist,
  } = useContext(PlaylistContext);
  const [playlist, setPlaylist] = useState(null);
  const [currPlaylist, setCurrPlaylist] = useState(null);
  const [PlaylistSec1, setPlaylistSec1] = useState(true);
  const [PlaylistSec2, setPlaylistSec2] = useState(false);
  const [showCreatePlaylistForm, setshowCreatePlaylistForm] = useState(false);

  const handleAllPlaylist = useCallback(async () => {
    if (showPlaylistDialogue) {
      const response = await getPrivatePlaylist();
      setPlaylist(response);
    }
    // eslint-disable-next-line
  }, [setPlaylist, showPlaylistDialogue, getPrivatePlaylist]);
  useEffect(() => {
    handleAllPlaylist();
  }, [handleAllPlaylist]);

  const handlePlaylist = async (currPlaylist) => {
    const playlistDetails = await getPrivatePlaylist(currPlaylist._id);
    setCurrPlaylist(playlistDetails[0]);
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
              <div>
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
                </div>
                {showCreatePlaylistForm && (
                  <>
                    <div>
                      <div>
                        <label
                          htmlFor="playlistName"
                          style={{ margin: "10px 0", display: "block" }}
                        >
                          Playlist Name
                        </label>
                        <input
                          className="playlistFormInput"
                          value={playlistDetails.name}
                          placeholder="Playlist Name"
                          name="name"
                          id="playlistName"
                          onChange={onChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="playlistPublic"
                          style={{
                            margin: "10px 0",
                            display: "block",
                          }}
                        >
                          Playlist should be public ?
                        </label>
                        <input
                          className="playlistFormInput"
                          value={playlistDetails.public}
                          list="public"
                          name="public"
                          onChange={onChange}
                          id="playlistPublic"
                        />
                        <datalist id="public">
                          <option value={true} />
                          <option value={false} />
                        </datalist>
                      </div>
                      <div>
                        <label
                          htmlFor="playlistDescription"
                          style={{
                            margin: "10px 0",
                            display: "block",
                          }}
                        >
                          Description
                        </label>
                        <textarea
                          className="playlistFormInput"
                          placeholder="playlist description"
                          value={playlistDetails.description}
                          onChange={onChange}
                          name="description"
                          id="playlistDescription"
                        ></textarea>
                      </div>

                      <div>
                        <button
                          className="btn"
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => handleSubmit()}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div style={{ overflow: "auto" }}>
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
            <CurrPlaylist
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
