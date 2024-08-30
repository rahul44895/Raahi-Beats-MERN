import React, { useContext, useState } from "react";
import { AudioContext } from "../../Context/Audio/AudioState";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdOutlineDragHandle, MdDelete } from "react-icons/md";
import { IoIosPlayCircle } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";

export default function PlaylistDialogueSection2({
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

  return (
    <>
      <div
        onClick={() => {
          setPlaylistSec1(true);
          setPlaylistSec2(false);
        }}
      >
        <button
          className="btn"
          style={{ display: "flex", textAlign: "center" }}
        >
          <IoArrowBackOutline /> Back
        </button>
      </div>
      {playlist && (
        <div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {!showForm ? (
                <>
                  <div>
                    <div>
                      <h1>{playlist.name}</h1>
                      <span style={{ color: "green" }}>
                        Playlist is{" "}
                        <b>{playlist.public ? "public" : "private"} </b>
                      </span>
                    </div>
                    <p>{playlist.description}</p>
                  </div>
                  <button
                    className="btn"
                    onClick={() => setShowForm(!showForm)}
                  >
                    Edit
                  </button>
                </>
              ) : (
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
            <span
              className="song-card-medium-play-icon"
              onClick={() =>
                playlist.songs.length > 0
                  ? addPlaylistToQueue(playlist.songs)
                  : alert("Add songs to the playlist")
              }
            >
              <IoIosPlayCircle />
            </span>
            <span
              className="song-card-medium-play-icon"
              onClick={() => deletePlaylist(playlist._id)}
            >
              <MdDelete />
            </span>
            <hr />
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="playlist">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    height: "65vh",
                    overflowY: "auto",
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
        </div>
      )}
    </>
  );
}
