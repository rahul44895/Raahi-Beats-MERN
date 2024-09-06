import { createContext, useContext, useRef, useState } from "react";
import { AlertContext } from "../Alert/AlertState";

const ShareContext = createContext();
export { ShareContext };

const ShareState = (props) => {
  const { showAlert } = useContext(AlertContext);

  const shareURL = useRef("");
  const [shareDialogue, showShareDialogue] = useState(false);

  const share = (song) => {
    showShareDialogue(true);
    const hostUrl = window.location.origin;
    shareURL.current = `${hostUrl}/song/${song._id}`;
    navigator.clipboard
      .writeText(shareURL.current)
      .then(() => {
        showAlert("Song URL copied to clipboard: ");
      })
      .catch((err) => {
        showAlert("Some error occured while generating the Share link");
        console.error("Failed to copy text: ", err);
      });
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
