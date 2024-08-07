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
  useEffect(() => {
    if (activeSongRef.current) {
      activeSongRef.current.scrollIntoView({
        behaviour: "smooth",
        block: "center",
      });
    }
  }, [currSong]);

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
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={`queue-item ${
                            item === currSong ? "queue-item-active" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className="queue-item-content"
                            onClick={() => play(item)}
                            ref={item === currSong ? activeSongRef : null}
                          >
                            <div className="queue-image-container">
                              {item === currSong ? (
                                <img
                                  src={PlayingBarGif}
                                  className="queue-playing-image"
                                />
                              ) : (
                                <span className="queue-play-icon">
                                  <IoIosPlayCircle />
                                </span>
                              )}
                              <img src={item.coverImage} className="queue-image" />
                            </div>
                            <div className="queue-text">
                              <p>{item.title}</p>
                              <p>
                                {item.artist
                                  ? item.artist.length > 30
                                    ? item.artist.slice(0, 30) + "..."
                                    : item.artist
                                  : "Unknown Artist"}
                              </p>
                            </div>
                          </div>
                          <MdOutlineDragHandle/>
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
