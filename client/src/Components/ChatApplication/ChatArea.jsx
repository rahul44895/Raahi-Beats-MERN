import React, { useCallback, useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/Alert/AlertState";

export default function ChatArea({
  currContactDetails,
  ownSocket,
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
    [host, showAlert]
  );
  useEffect(() => {
    if (currContactDetails)
      fetchMessages({ contactEmail: currContactDetails.email });
  }, [fetchMessages, currContactDetails]);

  return (
    <div style={{ backgroundColor: "red", flex: 2 }}>
      Chat Area
      {currContactDetails ? (
        <div>
          {currContactDetails.username}
          {/* {console.log(currContactDetails)} */}
          <div>Your Socket ID: {ownSocket.id}</div>
          <div>Receiver Socket ID:{currContactDetails.socketID}</div>
          <div>Receiver Email:{currContactDetails.email}</div>

          {messages.length > 0 ? (
            <div>
              {messages.map((currMessage) => {
                return <div key={currMessage._id}>{currMessage.message}</div>;
              })}
            </div>
          ) : (
            <div>Start conversation</div>
          )}
          <div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={() =>
                handleSendMessage({
                  message,
                  receiverEmail: currContactDetails.email,
                })
              }
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div>Select a contact...</div>
      )}
    </div>
  );
}
