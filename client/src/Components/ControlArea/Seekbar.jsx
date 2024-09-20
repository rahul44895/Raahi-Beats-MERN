import React, { useCallback, useEffect, useRef, useState } from "react";

export default function Seekbar({ currentTime, duration, handleSeek }) {
  const SeekBarContainerRef = useRef(null);
  const SeekBarRef = useRef(null);
  const [isMouseDragging, setisMouseDragging] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (isMouseDragging) {
        const currentSeekBarContainer =
          SeekBarContainerRef?.current?.getBoundingClientRect();
        const newWidth = e.clientX - currentSeekBarContainer.left;
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
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMouseDragging, handleMouseMove]);
  return (
    <div
      ref={SeekBarContainerRef}
      onMouseDown={handleMouseDown}
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
          backgroundColor: "#c20000",
          width: `${
            (SeekBarContainerRef?.current?.offsetWidth / duration.current) *
            currentTime
          }px`,
        }}
      ></div>
    </div>
  );
}
