import { createContext, useContext, useState } from "react";
import { AlertContext } from "../Alert/AlertState";

const SongContext = createContext();
export { SongContext };

const SongState = (props) => {
  let [songList, setSongList] = useState([]);
  const host = process.env.REACT_APP_HOST;
  const [songDetails, setSongDetails] = useState();
  const { showAlert } = useContext(AlertContext);
  const fetchSongs = async (songID) => {
    try {
      const url = songID ? `${host}/songs?search=${songID}` : `${host}/songs`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        return data.songs;
      } else {
        showAlert(data.error);
        return null;
      }
    } catch (error) {
      showAlert("Error fetching the songs");
      return false;
    }
  };

  let newReleaseFunc = async () => {
    try {
      let url = new URL(`${host}/songs/get/newrelease`);
      url = url.toString();

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        return data.songs;
      } else {
        console.error(data.error);
        showAlert(data.error);
        return null;
      }
    } catch (error) {
      showAlert("Error fetching the songs");
      return null;
    }
  };

  let oldReleaseFunc = async () => {
    try {
      let url = new URL(`${host}/songs/get/oldsongs`);
      url = url.toString();

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        return data.songs;
      } else {
        console.error(data.error);
        showAlert(data.error);
        return null;
      }
    } catch (error) {
      showAlert("Error fetching the songs");
      return null;
    }
  };

  let getDetails = (song) => {
    console.log(song);
  };

  const updatePlayDetails = async (songID) => {
    console.log("updating...", songID);
  };

  return (
    <SongContext.Provider
      value={{
        fetchSongs,
        newReleaseFunc,
        oldReleaseFunc,
        getDetails,
        songDetails,
        setSongDetails,
        songList,
        updatePlayDetails,
      }}
    >
      {props.children}
    </SongContext.Provider>
  );
};
export default SongState;
