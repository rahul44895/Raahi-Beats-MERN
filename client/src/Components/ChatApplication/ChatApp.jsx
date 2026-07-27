import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChatRoute.css";
import ContactsArea from "./ContactsArea";
import ChatArea from "./ChatArea";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { AlertContext } from "../../Context/Alert/AlertState";
import useNavbarHeight from "../../hooks/useNavbarHeight";
import useElementHeight from "../../hooks/useElementHeight";
import useIsMobile from "../../hooks/useIsMobile";

export default function ChatApp() {
  const navbarHeight = useNavbarHeight();
  const isMobile = useIsMobile();

  const { showAlert } = useContext(AlertContext);
  const [currContactDetails, setCurrContactDetails] = useState(null);
  const [ownSocket, setOwnSocket] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const chatAppContainer = useRef(null);
  // Only re-measure on mount/resize instead of reading offsetHeight inline on every render (once per chat message).
  const containerHeight = useElementHeight(chatAppContainer);
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
        localStorage.setItem("redirectPath", location.pathname);
        navigate("/login");
      } else showAlert(msg.message);
    });

    // CHATTING
    socket.on("server-message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("private-message-response", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => socket.disconnect();
  }, [host, location, navigate, showAlert]);

  const handleSendMessage = ({ message, receiverEmail }) => {
    if (!Cookies.get("token")) {
      localStorage.setItem("redirectPath", location.pathname);
      navigate("/login");
      showAlert("Please login.");
    }
    ownSocket.emit("private-message", { message, receiverEmail });
  };

  const [activeView, setactiveView] = useState("contacts");
  const toggleView = (view) => {
    if (view === "chats") {
      // Add a new entry to the history stack when switching to chat
      window.history.pushState(null, "", "");
    }
    setactiveView(view);
  };

  useEffect(() => {
    const handlePopState = () => {
      toggleView("contacts");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="homeContainer" ref={chatAppContainer}>
      <div style={{ height: `${navbarHeight}px` }}></div>
      {!isMobile && (
        <div
          style={{
            height: `${containerHeight - navbarHeight}px`,
          }}
          className="chat-app-container-desktop-8XyAQ"
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
      )}
      {isMobile && (
        <div
          style={{
            height: `${containerHeight - navbarHeight}px`,
          }}
        >
          {activeView === "contacts" ? (
            <ContactsArea
              setCurrContactDetails={(contactDetails) => {
                setCurrContactDetails(contactDetails);
                toggleView("chats");
              }}
            />
          ) : (
            <ChatArea
              currContactDetails={currContactDetails}
              ownSocket={ownSocket}
              handleSendMessage={handleSendMessage}
              messages={messages}
              setMessages={setMessages}
            />
          )}
        </div>
      )}
    </div>
  );
}
