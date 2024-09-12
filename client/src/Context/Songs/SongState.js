import { createContext, useCallback, useContext, useState } from "react";
import { AlertContext } from "../Alert/AlertState";
import Cookie from "js-cookie";

const SongContext = createContext();
export { SongContext };

const SongState = (props) => {
  // let [songList, setSongList] = useState([]);
  const host = process.env.REACT_APP_HOST;
  const [songDetails, setSongDetails] = useState();
  const { showAlert } = useContext(AlertContext);
  const fetchSongs = useCallback(
    async (songShortID) => {
      const userToken = Cookie.get("token");
      try {
        const url = songShortID
          ? `${host}/songs?search=${songShortID}`
          : `${host}/songs`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userToken: userToken ? userToken : null }),
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
    },
    [host, showAlert]
  );

  let newReleaseFunc = useCallback(async () => {
    const userToken = Cookie.get("token");
    try {
      let url = new URL(`${host}/songs/get/newrelease`);
      url = url.toString();

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userToken: userToken ? userToken : null }),
      });

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
  }, [host, showAlert]);

  let oldReleaseFunc = useCallback(async () => {
    const userToken = Cookie.get("token");
    try {
      let url = new URL(`${host}/songs/get/oldsongs`);
      url = url.toString();

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userToken: userToken ? userToken : null }),
      });

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
  }, [host, showAlert]);

  const updatePlayDetails = useCallback(
    async ({ songID, playCount, likeCount }) => {
      try {
        const user = Cookie.get("token");

        const response = await fetch(`${host}/songs/update/playnlikes`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            songID,
            user: user ? user : null,
            playCount: playCount ? playCount : null,
            likeCount: likeCount ? likeCount : null,
          }),
        });
        const data = await response.json();
        if (!data.success) {
          if (likeCount) showAlert(data.error);
          else console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [host, showAlert]
  );

  const updateSong = useCallback(
    async ({ songID, details }) => {
      try {
        const response = await fetch(`${host}/songs/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: songID, details }),
        });
        await response.json();
      } catch (error) {
        console.log(error);
      }
    },
    [host]
  );
  return (
    <SongContext.Provider
      value={{
        fetchSongs,
        newReleaseFunc,
        oldReleaseFunc,
        songDetails,
        setSongDetails,
        updatePlayDetails,
        updateSong,
      }}
    >
      {props.children}
    </SongContext.Provider>
  );
};
export default SongState;
