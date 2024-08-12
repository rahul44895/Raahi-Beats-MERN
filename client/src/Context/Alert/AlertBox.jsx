import React, { useEffect, useRef } from "react";
import "./AlertBoxStyle.css";

export default function AlertBox({ message, onClose }) {
  const alertRef = useRef(null);
  useEffect(() => {
    setTimeout(() => alertRef.current.classList.add("alert-exit-anime"), 4998);
    setTimeout(() => onClose(), 5998);
  }, []);
  return (
    <div className="queue-alert-overlay" ref={alertRef}>
      <div className="queue-alert-box">
        <div className="queue-alert-message">{message}</div>
        <div className="queue-alert-close"></div>
      </div>
    </div>
  );
}
