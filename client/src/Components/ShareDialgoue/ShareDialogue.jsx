import React, { useContext } from "react";
import { ShareContext } from "../../Context/Share/ShareState";
import { IoMdClose } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import "./ShareDialogue.css";
import { AlertContext } from "../../Context/Alert/AlertState";

const ShareDialogue = () => {
  // useContext
  const { shareDialogue, showShareDialogue, shareURL } =
    useContext(ShareContext);
  const { showAlert } = useContext(AlertContext);

  // useState

  // functions

  return (
    <>
      {shareDialogue && (
        <div className="share-overlay">
          <div className="share-dialogue">
            <div className="share-header">
              <h1 className="share-title">Share</h1>
              <span
                className="share-close-icon"
                onClick={() => showShareDialogue(false)}
              >
                <IoMdClose />
              </span>
            </div>
            <div
              className="share-url"
              onClick={(e) => {
                navigator.clipboard
                  .writeText(shareURL.current)
                  .then(() => {
                    showAlert("Song URL copied to clipboard: ");
                  })
                  .catch((err) => {
                    showAlert(
                      "Some error occured while generating the Share link"
                    );
                    console.error("Failed to copy text: ", err);
                  });
              }}
            >
              <span className="share-url-text">{shareURL.current}</span>
              <span>
                <MdOutlineContentCopy />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareDialogue;
