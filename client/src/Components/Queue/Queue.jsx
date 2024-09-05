import React, { useContext, useEffect, useRef } from "react";
import { AudioContext } from "../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";
import PlayingBarGif from "../../assets/images/miscellaneous/playingBarGif.gif";
import { MdOutlineDragHandle } from "react-icons/md";
import "./QueueStyle.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Queue() {
  const { queue, setQueue, play, currSong } = useContext(AudioContext);
  const activeSongRef = useRef(null);
  const host = process.env.REACT_APP_HOST;
  useEffect(() => {
    if (activeSongRef.current) {
      activeSongRef.current.scrollIntoView({
        behaviour: "smooth",
        block: "center",
      });
    }
  }, [activeSongRef]);

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const updatedQueue = Array.from(queue);
    const [movedItem] = updatedQueue.splice(source.index, 1);
    updatedQueue.splice(destination.index, 0, movedItem);

    setQueue(updatedQueue);
  };
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="playlist">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {queue.length > 0 ? (
                queue.map((item, index) => {
                  return (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={`queue-item ${
                            item._id === currSong._id ? "queue-item-active" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className="queue-item-content"
                            onClick={() => {
                              if (item._id !== currSong._id) play(item);
                            }}
                            ref={
                              item._id === currSong._id ? activeSongRef : null
                            }
                          >
                            {console.log("hi")}
                            <div className="queue-image-container">
                              {item._id === currSong._id ? (
                                <>
                                  <img
                                    src={PlayingBarGif}
                                    className="queue-playing-image"
                                    alt="play button"
                                  />
                                </>
                              ) : (
                                <span className="queue-play-icon">
                                  <IoIosPlayCircle />
                                </span>
                              )}
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
                          <MdOutlineDragHandle />
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
    </>
  );
}
