import { createContext, useState } from "react";
import Cookies from "js-cookie";

const PlaylistDialogueContext = createContext();
export { PlaylistDialogueContext };

const PlaylistDialogueState = (props) => {
  const [showPlaylistDialogue, setPlaylistDialogue] = useState(false);
  const [addSongToPlaylist, setaddSongToPlaylist] = useState(null);

  const [playList, setPlaylist] = useState([
    {
      id: 123,
      name: "Bedtime",
      description: "A collection of soothing songs to help you fall asleep.",
      creationDate: "2023-08-09",
      lastUpdated: "2024-08-09",
      public: true,
      songs: [
        {
          title: "Apna Bana Le",
          filePath: "./songs/apna bana le.m4a",
          coverImage: "./songs/Bhediya-Hindi-2023-20230927155213-500x500.jpg",
          album: "",
          artist: "Sachin-Jigar , Arijit Singh",
          releaseDate: "2023",
          id: "70c62951-4bec-463f-bf3b-08a60fea82a5",
        },
        {
          title: "Chal Wahan Jaate Hain",
          filePath: "./songs/Chal-Wahan-Jaate-Hain.m4a",
          coverImage: "./songs/Chal-Wahan-Jaate-Hain.jpg",
          album: "",
          artist: "Arijit Singh",
          releaseDate: "2015",
          id: "70c62951-4bec-463f-bf3b-08a00fea82a9",
        },
      ],
      user: "testUser44895",
    },
    {
      id: 234,
      name: "Playlist 2",
      description: "A collection of soothing songs to help you fall asleep.",
      creationDate: "2023-08-09",
      lastUpdated: "2024-08-09",
      public: true,
      songs: [],
      user: "testUser44895",
    },
    {
      id: 345,
      name: "Playlist 3",
      description: "A collection of soothing songs to help you fall asleep.",
      creationDate: "2023-08-09",
      lastUpdated: "2024-08-09",
      public: true,
      songs: [],
      user: "testUser44895",
    },
  ]);

  const getPlaylistData = () => {};

  const setShowPlaylistDialogue = (value) => {
    if (value === true) {
      // if (!Cookies.get("token")) return alert("You need to login first");
      getPlaylistData();
    }
    setPlaylistDialogue(value);
  };

  const addToPlaylist = (playlist) => {
    const songExists = playList.some(
      (curr) =>
        curr.id === playlist.id &&
        curr.songs.some((song) => song.id === addSongToPlaylist.id)
    );

    if (songExists) {
      return alert("Song already exists in the playlist");
    } else {
      let tempList = playList.map((curr) =>
        curr.id === playlist.id
          ? { ...curr, songs: [...curr.songs, addSongToPlaylist] }
          : curr
      );

      setPlaylist(tempList);
      alert(`Song successfully added to ${playlist.name}`);
    }
  };

  const updatePlaylist = (newPlaylist) => {
    setPlaylist((prevPlayList) =>
      prevPlayList.map((playlist) =>
        playlist.id === newPlaylist.id
          ? { ...playlist, ...newPlaylist }
          : playlist
      )
    );
  };

  const deletePlaylist = (playlist) => {
    let tempList = playList.filter((curr) => {
      return curr.id !== playlist.id;
    });
    setPlaylist(tempList);
    alert(`Successfully deleted ${playlist.name}`);
  };

  const createPlaylist = (name, description) => {
    if (!name) return alert("Enter a valid playlist name");
    setPlaylist((prev) => [
      ...prev,
      {
        id: Math.ceil(Math.random() * 1000),
        name: name,
        description: description ? description : "",
        creationDate: new Date(),
        lastUpdated: new Date(),
        public: true,
        songs: [],
        user: "testUser44895",
      },
    ]);
  };

  return (
    <PlaylistDialogueContext.Provider
      value={{
        showPlaylistDialogue,
        setShowPlaylistDialogue,
        playList,
        setPlaylist,
        updatePlaylist,
        addToPlaylist,
        setaddSongToPlaylist,
        deletePlaylist,
        createPlaylist,
      }}
    >
      {props.children}
    </PlaylistDialogueContext.Provider>
  );
};
export default PlaylistDialogueState;
