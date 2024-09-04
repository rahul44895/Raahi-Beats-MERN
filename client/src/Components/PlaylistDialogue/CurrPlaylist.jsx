import React, { useContext, useRef, useState } from "react";
import { AudioContext } from "../../Context/Audio/AudioState";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdOutlineDragHandle, MdDelete } from "react-icons/md";
import { IoIosPlayCircle } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import "./PlaylistDialogueStyle.css";

export default function CurrPlaylist({
  currPlaylist,
  setCurrPlaylist,
  setPlaylistSec1,
  setPlaylistSec2,
  updatePlaylistOrderFunc,
  updatePlaylistDetailsFunc,
  deletePlaylist,
  deleteSongFromPlaylist,
}) {
  const [playlist, setPlaylist] = useState(
    JSON.parse(JSON.stringify(currPlaylist))
  );
  const { play, addPlaylistToQueue } = useContext(AudioContext);

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const updatedSongs = Array.from(playlist.songs);
    const [movedItem] = updatedSongs.splice(source.index, 1);
    updatedSongs.splice(destination.index, 0, movedItem);

    const updatedPlaylist = { ...playlist, songs: updatedSongs };
    setPlaylist(updatedPlaylist);
    setCurrPlaylist(updatedPlaylist);
    updatePlaylistOrderFunc(updatedPlaylist);
  };
  const host = process.env.REACT_APP_HOST;
  const [showForm, setShowForm] = useState(false);
  const [playlistDetails, setplaylistDetails] = useState({
    _id: playlist._id,
    name: playlist.name,
    public: playlist.public,
    description: playlist.description,
  });
  const onChange = (e) => {
    setplaylistDetails({
      ...playlistDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const response = await updatePlaylistDetailsFunc(playlistDetails);
    if (response) {
      setplaylistDetails(response);
      setShowForm(!showForm);
    }
  };
  const PlaylistDialogueRef = useRef(null);
  return (
    <>
      <div className="currPlaylistDialogue" ref={PlaylistDialogueRef}>
        <button
          onClick={() => {
            PlaylistDialogueRef.current.classList.add(
              "curr-playlist-dialogue-exit"
            );
            setTimeout(() => {
              setPlaylistSec1(true);
              setPlaylistSec2(false);
            }, 200);
          }}
          className="btn"
          style={{ display: "flex", textAlign: "center" }}
        >
          <IoArrowBackOutline /> Back
        </button>
        <hr />
        <div>
          {!showForm ? (
            <>
              <div>
                <div>
                  <h1>{playlist.name}</h1>
                  <p style={{ color: "green" }}>
                    Playlist is
                    <b> {playlist.public ? "public" : "private"} </b>
                  </p>
                </div>
                <p>{playlist.description}</p>
              </div>
              <button className="btn" onClick={() => setShowForm(!showForm)}>
                Edit
              </button>
            </>
          ) : (
            <>
              <div>
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
                      onChange={onChange}
                      id="playlistName"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="playlistPublic"
                      style={{ margin: "10px 0", display: "block" }}
                    >
                      Playlist should be public
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
                      style={{ margin: "10px 0", display: "block" }}
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
                </div>
                <button
                  className="btn"
                  onClick={() => handleSubmit()}
                  style={{ width: "100%" }}
                >
                  Save
                </button>
                <button
                  className="btn"
                  onClick={() => setShowForm(!showForm)}
                  style={{ width: "100%" }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <button
              className="btn"
              style={{
                width: "40%",
                fontSize: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() =>
                playlist.songs.length > 0
                  ? addPlaylistToQueue(playlist.songs)
                  : alert("Add songs to the playlist")
              }
            >
              <span>
                <IoIosPlayCircle />
              </span>
              Play the playlist
            </button>
            <button
              className="btn"
              style={{
                background: "red",
                width: "40%",
                fontSize: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => deletePlaylist(playlist._id)}
            >
              <span>
                <MdDelete />
              </span>
              Delete this playlist
            </button>
            <hr />
          </div>
        </div>
      </div>

      {playlist && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  overflow: "auto",
                }}
              >
                {playlist.songs && playlist.songs.length > 0 ? (
                  playlist.songs.map((item, index) => {
                    return (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={`queue-item`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div
                              className="queue-item-content"
                              onClick={() => play(item)}
                            >
                              <div className="queue-image-container">
                                <span className="queue-play-icon">
                                  <IoIosPlayCircle />
                                </span>
                                <img
                                  src={`${host}/${item.coverImage}`}
                                  className="queue-image"
                                  alt={item.title}
                                />
                              </div>
                              <div className="queue-text">
                                <p>{item.title}</p>
                                <p style={{ textWrap: "wrap" }}>
                                  {/* {item.artists
                                      ? item.artists.map((e, index) => {
                                          return (
                                            <span>
                                              {e.name}
                                              {index !== item.artists.length - 1
                                                ? ", "
                                                : ""}
                                            </span>
                                          );
                                        })
                                      : "Unknown Artist"} */}
                                </p>
                              </div>
                            </div>
                            <span
                              style={{ padding: "1em", cursor: "pointer" }}
                              onClick={async () => {
                                const response = await deleteSongFromPlaylist(
                                  playlist._id,
                                  item._id
                                );
                                if (response === true) {
                                  let tempSongs = playlist.songs.filter(
                                    (curr) => curr._id !== item._id
                                  );
                                  setPlaylist({
                                    ...playlist,
                                    songs: tempSongs,
                                  });
                                }
                              }}
                            >
                              <MdDelete />
                            </span>
                            <span
                              style={{ padding: "1em", cursor: "row-resize" }}
                            >
                              <MdOutlineDragHandle />
                            </span>
                          </div>
                        )}
                      </Draggable>
                    );
                  })
                ) : (
                  <p>Add songs to the playlist :D</p>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}
