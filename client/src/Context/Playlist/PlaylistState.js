import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { AlertContext } from "../Alert/AlertState";

const PlaylistContext = createContext();
export { PlaylistContext };

const PlaylistState = (props) => {
  const { showAlert } = useContext(AlertContext);
  const host = process.env.REACT_APP_HOST;
  const [playlist, setPlaylist] = useState([]);
  const [showPlaylistDialogue, setshowPlaylistDialogue] = useState(false);
  const [tempPlaylistSong, setTempPlaylistSong] = useState(null);

  const getallPlaylist = async ({ user }) => {
    try {
      const login = Cookies.get("token");
      if (!login) return showAlert("You need to login first.");
      const response = await fetch(`${host}/playlist/get`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ user }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setPlaylist(data.playlist);
      } else {
        showAlert("Some error occured");
      }
    } catch (err) {
      showAlert("Some error occured");
      console.error(err);
    }
  };

  const getPlaylistDetails = async (playlist) => {
    try {
      const login = Cookies.get("token");
      if (!login) return showAlert("You need to login first.");
      const response = await fetch(`${host}/playlist/get/${playlist._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        return data.playlist;
      } else {
        showAlert("Some error occured.");
        return [];
      }
    } catch (err) {
      showAlert("Some error occured.");
      console.error(err);
      return [];
    }
  };

  const handleshowPlaylistDialogue = (song) => {
    const login = Cookies.get("token");
    if (!login) return showAlert("You need to login first.");
    setshowPlaylistDialogue(true);
    setTempPlaylistSong(song);
  };

  const addToPlaylistFunc = async (playlistID) => {
    try {
      const login = Cookies.get("token");
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
  };
  const updatePlaylistOrderFunc = async (playlist) => {
    try {
      const login = Cookies.get("token");
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
  };

  const updatePlaylistDetailsFunc = async (playlistDetails) => {
    const login = Cookies.get("token");
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
  };

  const deletePlaylist = async (playlistID) => {
    try {
      const login = Cookies.get("token");
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
  };

  const createPlaylist = async (playlistDetails) => {
    try {
      const login = Cookies.get("token");
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
  };

  const deleteSongFromPlaylist = async (playlistID, songID) => {
    try {
      const login = Cookies.get("token");
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
  };
  return (
    <PlaylistContext.Provider
      value={{
        showPlaylistDialogue,
        handleshowPlaylistDialogue,
        playlist,
        getallPlaylist,
        getPlaylistDetails,
        setshowPlaylistDialogue,
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
