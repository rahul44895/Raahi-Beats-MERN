import { createContext, useCallback, useContext, useState } from "react";
import Cookie from "js-cookie";
import { AlertContext } from "../Alert/AlertState";
import { useNavigate } from "react-router-dom";

const PlaylistContext = createContext();
export { PlaylistContext };

const PlaylistState = (props) => {
  const { showAlert } = useContext(AlertContext);

  const [playlist, setPlaylist] = useState([]);
  const [showPlaylistDialogue, setshowPlaylistDialogue] = useState(false);
  const [tempPlaylistSong, setTempPlaylistSong] = useState(null);

  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();

  //GET PLAYLIST FUNC
  const getPublicPlaylist = useCallback(
    async (playlistID) => {
      const userToken = Cookie.get("token");
      try {
        const response = await fetch(`${host}/playlist/get/public`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: playlistID ? playlistID : null,
            userToken: userToken ? userToken : null,
          }),
        });

        const data = await response.json();
        if (data.success) {
          return data.playlist;
        } else {
          showAlert("Error fetching the songs");
          return null;
        }
      } catch (error) {
        showAlert("Error fetching the songs");
        console.log(error);
        return null;
      }
    },
    [host, showAlert]
  );

  const getPrivatePlaylist = useCallback(
    async (playlistID) => {
      const userToken = Cookie.get("token");
      if (!userToken) {
        showAlert("You need to login first to see your private playlists.");
        return null;
      }
      try {
        const response = await fetch(`${host}/playlist/get/private`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: playlistID ? playlistID : null,
            userToken: userToken ? userToken : null,
          }),
        });
        const data = await response.json();
        // console.log(data);
        if (response.ok && data.success) {
          // setPlaylist(data.playlist);
          return data.playlist;
        } else {
          showAlert("Error fetching the songs");
          return null;
        }
      } catch (error) {
        showAlert("Error fetching the songs");
        console.log(error);
        return null;
      }
    },
    [host, showAlert]
  );

  const handleshowPlaylistDialogue = (song) => {
    const login = Cookie.get("token");
    if (!login) {
      showAlert("You need to login first.");
      navigate("/login");
      return;
    }
    setshowPlaylistDialogue(true);
    setTempPlaylistSong(song);
  };

  const addToPlaylistFunc = useCallback(
    async (playlistID) => {
      try {
        if (!tempPlaylistSong) return showAlert("Choose a song to add.");
        const login = Cookie.get("token");
        if (!login) return showAlert("You need to login first.");
        const response = await fetch(`${host}/playlist/update`, {
          method: "PUT",
          body: JSON.stringify({
            _id: playlistID,
            songs: [{ _id: tempPlaylistSong._id }],
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        showAlert(data.message);
      } catch (error) {
        showAlert("Some error occured");
        console.error(error);
      }
    },
    [host, showAlert, tempPlaylistSong]
  );
  const updatePlaylistOrderFunc = useCallback(
    async (playlist) => {
      try {
        const login = Cookie.get("token");
        if (!login) return showAlert("You need to login first.");
        const response = await fetch(`${host}/playlist/update`, {
          method: "PUT",
          body: JSON.stringify({
            _id: playlist._id,
            songs: playlist.songs,
            playlistSongOrder: true,
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        showAlert(data.message);
      } catch (error) {
        showAlert("Some error occured");
        console.error(error);
      }
    },
    [host, showAlert]
  );

  const updatePlaylistDetailsFunc = useCallback(
    async (playlistDetails) => {
      const login = Cookie.get("token");
      if (!login) return showAlert("You need to login first.");
      const tempPlaylist = {};
      tempPlaylist._id = playlistDetails._id;
      if (playlistDetails.name) tempPlaylist.name = playlistDetails.name;
      if (playlistDetails.public) tempPlaylist.public = playlistDetails.public;
      if (playlistDetails.description)
        tempPlaylist.description = playlistDetails.description;
      try {
        const response = await fetch(`${host}/playlist/update`, {
          method: "PUT",
          body: JSON.stringify(tempPlaylist),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        showAlert(data.message);
        return playlistDetails;
      } catch (error) {
        showAlert("Some error occured");
        console.error(error);
        return null;
      }
    },
    [host, showAlert]
  );

  const deletePlaylist = useCallback(
    async (playlistID) => {
      try {
        const login = Cookie.get("token");
        if (!login) return showAlert("You need to login first.");
        const confirm = window.confirm(
          "Are you sure that you want to delete the playlist ?"
        );
        if (!confirm) {
          return;
        }
        const response = await fetch(`${host}/playlist/delete`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: playlistID }),
        });
        const data = await response.json();
        if (data.success) {
          let temp = JSON.parse(JSON.stringify(playlist));
          temp = temp.filter((curr) => curr._id !== playlistID);
          setPlaylist(temp);
          showAlert(data.message);
        } else {
          showAlert(data.error);
        }
      } catch (err) {
        showAlert("Some error occured.");
        console.log(err);
      }
    },
    [host, showAlert, playlist]
  );

  const createPlaylist = useCallback(
    async (playlistDetails) => {
      try {
        const login = Cookie.get("token");
        if (!login) return showAlert("You need to login first.");
        const tempPlaylist = {};
        if (playlistDetails.name) tempPlaylist.name = playlistDetails.name;
        if (playlistDetails.public !== undefined)
          tempPlaylist.public = playlistDetails.public;
        if (playlistDetails.description)
          tempPlaylist.description = playlistDetails.description;
        const response = await fetch(`${host}/playlist/add`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tempPlaylist),
        });
        const data = await response.json();
        if (data.success) {
          showAlert(data.message);
          setPlaylist((playlist) => [...playlist, data.playlist]);
          return true;
        } else {
          showAlert(data.error);
          return false;
        }
      } catch (err) {
        showAlert("Some error has occurred");
        console.log(err);
        return false;
      }
    },
    [host, showAlert]
  );

  const deleteSongFromPlaylist = useCallback(
    async (playlistID, songID) => {
      try {
        const login = Cookie.get("token");
        if (!login) return showAlert("You need to login first.");
        const response = await fetch(`${host}/playlist/update/song`, {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ playlistID, songID }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.success) {
          showAlert(data.message);
          return true;
        } else {
          showAlert(data.error);
          return false;
        }
      } catch (error) {
        showAlert("Some error occured.");
        console.error(error);
        return false;
      }
    },
    [host, showAlert]
  );
  return (
    <PlaylistContext.Provider
      value={{
        showPlaylistDialogue,
        handleshowPlaylistDialogue,
        playlist,
        setshowPlaylistDialogue,
        getPublicPlaylist,
        getPrivatePlaylist,
        addToPlaylistFunc,
        updatePlaylistOrderFunc,
        updatePlaylistDetailsFunc,
        deletePlaylist,
        createPlaylist,
        deleteSongFromPlaylist,
      }}
    >
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistState;
