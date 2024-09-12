import { createContext, useContext, useRef, useState } from "react";
import { AlertContext } from "../Alert/AlertState";

const ShareContext = createContext();
export { ShareContext };

const ShareState = (props) => {
  const { showAlert } = useContext(AlertContext);

  const host = process.env.REACT_APP_HOST;
  const shareURL = useRef("");
  const [shareDialogue, showShareDialogue] = useState(false);

  const share = async (song) => {
    try {
      showShareDialogue(true);

      const response = await fetch(`${host}/utils/share-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songID: song._id }),
      });
      const data = await response.json();
      if (!data.success) {
        return showAlert("Some error occured while generating the Share link.");
      }

      const hostUrl = window.location.origin;
      shareURL.current = `${hostUrl}/${data.songURL}`;
      navigator.clipboard
        .writeText(shareURL.current)
        .then(() => {
          showAlert("Song URL copied to clipboard: ");
        })
        .catch((err) => {
          showAlert(
            "Some error occured while copying the Share link to the clipboard."
          );
          console.error("Failed to copy text: ", err);
        });
    } catch (error) {
      showAlert("Some error occured while generating the Share link");
      console.error("Failed to generate shareable Link: ", error);
    }
  };

  return (
    <ShareContext.Provider
      value={{
        share,
        shareDialogue,
        showShareDialogue,
        shareURL,
      }}
    >
      {props.children}
    </ShareContext.Provider>
  );
};
export default ShareState;
