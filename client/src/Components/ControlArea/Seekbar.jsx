import React, { useCallback, useEffect, useRef, useState } from "react";

export default function Seekbar({ currentTime, duration, handleSeek }) {
  const SeekBarContainerRef = useRef(null);
  const SeekBarRef = useRef(null);
  const [isMouseDragging, setisMouseDragging] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      // Use e.touches[0] for touch events, or e.clientX for mouse events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      if (isMouseDragging) {
        const currentSeekBarContainer =
          SeekBarContainerRef?.current?.getBoundingClientRect();
        const newWidth = clientX - currentSeekBarContainer.left;
        if (newWidth >= 0 && newWidth < currentSeekBarContainer.width) {
          SeekBarRef.current.style.width = `${newWidth}px`;
          handleSeek(
            (duration.current / currentSeekBarContainer.width) * newWidth
          );
        }
      }
    },
    [isMouseDragging, handleSeek, duration]
  );

  const handleMouseDown = () => {
    setisMouseDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setisMouseDragging(false);
    };

    if (isMouseDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isMouseDragging, handleMouseMove]);
  return (
    <div
      ref={SeekBarContainerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        height: "5px",
        backgroundColor: "#efefef",
        width: "100%",
      }}
    >
      <div
        ref={SeekBarRef}
        style={{
          height: "5px",
          backgroundColor: "red",
          width: `${
            (SeekBarContainerRef?.current?.offsetWidth / duration.current) *
            currentTime
          }px`,
        }}
      ></div>
    </div>
  );
}
