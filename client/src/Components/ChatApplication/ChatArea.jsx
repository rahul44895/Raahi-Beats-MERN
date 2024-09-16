import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertContext } from "../../Context/Alert/AlertState";

export default function ChatArea({
  currContactDetails,
  handleSendMessage,
  messages,
  setMessages,
}) {
  const { showAlert } = useContext(AlertContext);
  const [message, setMessage] = useState("");
  const host = process.env.REACT_APP_HOST;

  const fetchMessages = useCallback(
    async ({ contactEmail }) => {
      const response = await fetch(`${host}/chat/get/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        showAlert(data.error);
      }
    },
    [host, showAlert, setMessages]
  );
  useEffect(() => {
    if (currContactDetails)
      fetchMessages({ contactEmail: currContactDetails.email });
  }, [fetchMessages, currContactDetails]);

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const today = new Date();

    // Check if the date is the same as today's date
    const isToday =
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();

    if (isToday) {
      // If it's today, return only the time
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Set to false for 24-hour format
      });
    } else {
      // If it's not today, return the full date and time
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long", // Use 'short' for abbreviated month names
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Set to false for 24-hour format
      });
    }
  }

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  useEffect(() => scrollToBottom(), [messages]);

  return (
    <div className="chat-area-container-001">
      {currContactDetails ? (
        <div className="chat-area-content-001">
          <div className="chat-header-001">
            <div className="chat-header-info-001">
              <div className="chat-header-info-avatar-001">
                <img
                  src={`${host}/${currContactDetails.avatar}`}
                  alt={currContactDetails.username}
                />
              </div>
              <div className="chat-header-info-username-001">
                {currContactDetails.username}
              </div>
            </div>
            {messages.length > 0 ? (
              <div className="messages-container-001">
                {messages.map((currMessage) => (
                  <div
                    className={`chat-message-001 ${
                      currContactDetails.email === currMessage.senderEmail
                        ? "chat-message-received-001"
                        : "chat-message-sent-001"
                    }`}
                    key={currMessage._id}
                  >
                    <div className="message-content-001">
                      <span className="message-text-001">
                        {currMessage.message}
                      </span>
                      <span className="message-time-001">
                        {formatDateTime(currMessage.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />{" "}
                {/* Ref to mark the end of messages */}
              </div>
            ) : (
              <div className="start-conversation-001">Start a conversation</div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (message === "") return;
              handleSendMessage({
                message,
                receiverEmail: currContactDetails.email,
              });
              setMessage("");
            }}
            className="message-form-001"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type in your message..."
              className="message-form-input-001"
            />
            <button type="submit" className="message-form-button-001">
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="select-contact-001">Select a contact...</div>
      )}
    </div>
  );
}
