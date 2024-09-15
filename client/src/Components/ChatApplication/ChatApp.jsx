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
      {window.innerWidth > 1000 && (
        <div
          style={{
            height: `${
              chatAppContainer?.current?.offsetHeight - navbarHeight
            }px`,
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
      {window.innerWidth < 1000 && (
        <div
          style={{
            height: `${
              chatAppContainer?.current?.offsetHeight - navbarHeight
            }px`,
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
