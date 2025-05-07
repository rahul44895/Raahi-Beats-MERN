import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/Alert/AlertState";

export default function ContactsArea({
  currContactDetails,
  setCurrContactDetails,
}) {
  const { showAlert } = useContext(AlertContext);

  const [contactList, setContactList] = useState(null);
  const [newContactEmail, setnewContactEmail] = useState("");
  const host = process.env.REACT_APP_HOST;

  const handleContactClick = (contact) => {
    if (contact === currContactDetails) return;
    setCurrContactDetails(contact);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${host}/chat/get`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setContactList(data.contacts);
        } else {
          showAlert(data.error);
        }
      } catch (error) {
        showAlert("Some error occured.");
      }
    };
    fetchContacts();
  }, [host, showAlert]);

  const handleContactSave = async () => {
    if (!newContactEmail) return showAlert("Enter contact email.");
    const response = await fetch(`${host}/chat/add`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newContactEmail }),
    });
    const data = await response.json();
    if (!data.success) {
      showAlert(data.error);
    } else {
      setContactList([...contactList, data.contact]);
    }
  };
  return (
    <div className="chat-route__container">
      <div>
        <form
          style={{ textAlign: "center" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleContactSave();
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              color: "white",
              margin: "0 auto",
              maxWidth: "203px",
            }}
          >
            <input
              placeholder="Enter email..."
              class="search-input"
              value={newContactEmail}
              onChange={(e) => setnewContactEmail(e.target.value)}
            />
            <div class="search-icon" onClick={handleContactSave}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
              </svg>
            </div>
          </div>
        </form>
      </div>
      {contactList
        ? contactList.map((currContact) => {
            return (
              <div
                key={currContact._id}
                className="chat-route__contact-item"
                onClick={() => {
                  handleContactClick(currContact);
                }}
              >
                <div className="chat-route__contact-avatar">
                  <img
                    src={`${host}/${currContact.avatar}`}
                    alt={currContact.username}
                  />
                </div>
                <div className="chat-route__contact-username">
                  {currContact.username}
                </div>
              </div>
            );
          })
        : "Add contacts to see them here."}
    </div>
  );
}
