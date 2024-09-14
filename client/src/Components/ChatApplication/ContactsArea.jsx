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
        <h1>Add Contact</h1>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={newContactEmail}
            onChange={(e) => setnewContactEmail(e.target.value)}
          />
          <button onClick={handleContactSave} className="btn">
            Save
          </button>
        </div>
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
