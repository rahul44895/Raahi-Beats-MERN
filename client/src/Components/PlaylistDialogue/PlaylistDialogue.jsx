import React, { useContext, useEffect, useRef, useState } from "react";
import "./PlaylistDialogueStyle.css";
import { PlaylistDialogueContext } from "../../Context/Playlist/PlaylistDialogueState";
import { IoIosCloseCircleOutline, IoIosPlayCircle } from "react-icons/io";
import { MdPlaylistAdd, MdOutlineDragHandle, MdDelete } from "react-icons/md";
import { IoArrowBackOutline, IoAddCircle } from "react-icons/io5";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AudioContext } from "../../Context/Audio/AudioState";

export default function PlaylistDialogue() {
  const {
    showPlaylistDialogue,
    setShowPlaylistDialogue,
    playList,
    updatePlaylist,
    addToPlaylist,
    deletePlaylist,
    createPlaylist,
  } = useContext(PlaylistDialogueContext);
  const { play, playbtnAddToQueue, addPlaylistToQueue } =
    useContext(AudioContext);

  const playlistDialogueRef = useRef(null);

  const [playlistContent, setplaylistContent] = useState(null);
  const [editableplaylistContent, editablesetplaylistContent] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
  const [showEditField, setShowEditField] = useState(false);

  const handleClose = () => {
    playlistDialogueRef.current.classList.add("playlist-container-exit");
    setTimeout(() => setShowPlaylistDialogue(false), 200);
  };

  const handlePlaylistContentVis = (playlist) => {
    setplaylistContent(playlist);
    editablesetplaylistContent(playlist);
  };

  const handlePlaylistContent = (e) => {
    editablesetplaylistContent({
      ...playlistContent,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (playlistContent === editableplaylistContent)
      return alert("Nothing to change");
    else {
      updatePlaylist(editableplaylistContent);
      alert("Playlist Saved successfully");
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const updatedQueue = Array.from(editableplaylistContent.songs);
    const [movedItem] = updatedQueue.splice(source.index, 1);
    updatedQueue.splice(destination.index, 0, movedItem);

    editablesetplaylistContent({
      ...editableplaylistContent,
      ["songs"]: updatedQueue,
    });
  };

  const handleDelete = (song) => {
    let temp = editableplaylistContent.songs;
    temp = temp.filter((curr) => curr != song);
    editablesetplaylistContent({ ...editableplaylistContent, ["songs"]: temp });
  };

  return (
    <>
      {showPlaylistDialogue && (
        <div className="playlist-dialogue-container" ref={playlistDialogueRef}>
          <div
            style={{
              flexShrink: 0,
            }}
          >
            <h1
              style={{
                padding: "1em",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {playList.length > 1 ? "PLAYLISTS" : "PLAYLIST"}
              <span onClick={() => handleClose()} style={{ cursor: "pointer" }}>
                <IoIosCloseCircleOutline />
              </span>
            </h1>
            <hr />
          </div>
          <div className="playlist-dialogue-content">
            {!playlistContent && (
              <>
                <div
                  className="btn"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "1em",
                  }}
                  onClick={() => setShowEditField(!showEditField)}
                >
                  <span style={{ fontSize: "1.625rem" }}>
                    <MdPlaylistAdd />
                  </span>
                  Create New Playlist
                </div>
                {showEditField && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ fontWeight: 700, flex: 2 }}>
                      <input
                        className="btn"
                        style={{ background: "white", color: "black" }}
                        name="name"
                        placeholder="Enter playlist name..."
                        value={newPlaylist.name}
                        onChange={(e) =>
                          setNewPlaylist({
                            ...newPlaylist,
                            ["name"]: e.target.value,
                          })
                        }
                      />
                      <input
                        className="btn"
                        style={{ background: "white", color: "black" }}
                        name="description"
                        placeholder="Enter playlist descrition..."
                        value={newPlaylist.description}
                        onChange={(e) =>
                          setNewPlaylist({
                            ...newPlaylist,
                            ["description"]: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn"
                      style={{ flexShrink: 0 }}
                      onClick={() =>
                        createPlaylist(
                          newPlaylist.name,
                          newPlaylist.description
                        )
                      }
                    >
                      Save
                    </button>
                  </div>
                )}
                {playList && playList.length > 0
                  ? playList.map((playlist) => {
                      return (
                        <div className="playlist-dialogue-item">
                          <div
                            className="playlist-dialogue-item-info"
                            onClick={() => handlePlaylistContentVis(playlist)}
                          >
                            <div className="playlist-dialogue-item-play">
                              <IoIosPlayCircle />
                            </div>

                            <div>
                              <p>{playlist.name}</p>
                            </div>
                          </div>

                          <span
                            className="playlist-dialogue-item-add"
                            onClick={() => addToPlaylist(playlist)}
                          >
                            <IoAddCircle />
                          </span>
                        </div>
                      );
                    })
                  : "Add a new playlist"}
              </>
            )}
            {editableplaylistContent && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: "1em",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handlePlaylistContentVis(null);
                  }}
                >
                  <IoArrowBackOutline />
                  Back
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <input
                      className="btn"
                      style={{ fontWeight: 700, flex: 2 }}
                      value={editableplaylistContent.name}
                      onChange={handlePlaylistContent}
                      name="name"
                    />
                    <input
                      className="btn"
                      style={{ fontWeight: 700, flex: 2 }}
                      value={editableplaylistContent.description}
                      onChange={handlePlaylistContent}
                      name="description"
                    />
                  </div>
                  <button
                    className="btn"
                    style={{ flexShrink: 0 }}
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
                <div
                  className="btn"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "red",
                  }}
                  onClick={() => deletePlaylist(playlistContent)}
                >
                  <span style={{ fontSize: "1.625rem" }}>
                    <MdDelete />
                  </span>
                  Delete this Playlist
                </div>

                {editableplaylistContent.songs &&
                  editableplaylistContent.songs.length > 0 && (
                    <div
                      className="btn"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={() =>
                        addPlaylistToQueue(editableplaylistContent.songs)
                      }
                    >
                      <span style={{ fontSize: "1.625rem" }}>
                        <IoIosPlayCircle />
                      </span>
                      Play this Playlist
                    </div>
                  )}
                <div>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="playlist">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {editableplaylistContent.songs &&
                          editableplaylistContent.songs.length > 0 ? (
                            editableplaylistContent.songs.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
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
                                        onClick={() => {
                                          play(item);
                                          playbtnAddToQueue(item);
                                        }}
                                      >
                                        <div className="queue-image-container">
                                          <span className="queue-play-icon">
                                            <IoIosPlayCircle />
                                          </span>

                                          <img
                                            src={item.coverImage}
                                            className="queue-image"
                                          />
                                        </div>
                                        <div className="queue-text">
                                          <p>{item.title}</p>
                                          <p>
                                            {item.artist
                                              ? item.artist.length > 30
                                                ? item.artist.slice(0, 30) +
                                                  "..."
                                                : item.artist
                                              : "Unknown Artist"}
                                          </p>
                                        </div>
                                      </div>
                                      <div
                                        style={{ fontSize: "1.625rem" }}
                                        onClick={() => handleDelete(item)}
                                      >
                                        <MdDelete />
                                      </div>
                                      <div style={{ fontSize: "1.625rem" }}>
                                        <MdOutlineDragHandle />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })
                          ) : (
                            <p>Add songs to the queue :D</p>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
