import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChatRoute.css";
import ContactsArea from "./ContactsArea";
import ChatArea from "./ChatArea";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { AlertContext } from "../../Context/Alert/AlertState";

export default function ChatApp() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { showAlert } = useContext(AlertContext);
  const [currContactDetails, setCurrContactDetails] = useState(null);
  const [ownSocket, setOwnSocket] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const chatAppContainer = useRef(null);
  const host = process.env.REACT_APP_HOST;

  useEffect(() => {
    const socket = io(`${host}/chatnamespace`);
    socket.on("connect", () => {
      showAlert("Connected");
      setOwnSocket(socket);
    });

    // REGISTRATION
    socket.emit("register", { token: Cookies.get("token") });
    socket.on("registerResponse", (msg) => {
      if (msg.success === false) {
        showAlert(msg.error);
        localStorage.setItem("redirectPath", location);
        navigate("/login");
      } else showAlert("Registered. You're ready to chat...");
    });

    // CHATTING
    socket.on("server-message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => socket.disconnect();
  }, [host, location, navigate, showAlert]);

  const handleSendMessage = ({ message, receiverEmail }) => {
    ownSocket.emit("private-message", { message, receiverEmail });
  };

  return (
    <div className="homeContainer" ref={chatAppContainer}>
      <div style={{ height: `${navbarHeight}px` }}></div>
      <div
        style={{
          display: "flex",
          height: `${chatAppContainer?.current?.offsetHeight - navbarHeight}px`,
        }}
      >
        <ContactsArea setCurrContactDetails={setCurrContactDetails} />
        <ChatArea
          currContactDetails={currContactDetails}
          ownSocket={ownSocket}
          handleSendMessage={handleSendMessage}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}
