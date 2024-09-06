import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SongContext } from "../../Context/Songs/SongState";
import { AudioContext } from "../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";
import PlayingBarGif from "../../assets/images/miscellaneous/playingBarGif.gif";
import noArtistImage from "../../assets/images/miscellaneous/no-artist-image.jpg";

export default function SongDetailsPage() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { fetchSongs } = useContext(SongContext);
  const { play, playbtnAddToQueue, currSong } = useContext(AudioContext);

  const { songID } = useParams();
  const host = process.env.REACT_APP_HOST;

  const [song, setSong] = useState(null);
  const [songAlbum, setSongAlbum] = useState(null);

  const handleFetching = async () => {
    if (songID) {
      const response = await fetchSongs(songID);
      setSong(response[0]);
      if (response[0].album) {
        const responseAlbum = await fetchSongs(response[0].album);
        setSongAlbum(responseAlbum);
      }
    }
  };

  useEffect(() => {
    handleFetching();
    // eslint-disable-next-line
  }, [songID]);

  return (
    <>
      <div className="homeContainer">
        <div style={{ height: `${navbarHeight}px` }}></div>

        {song ? (
          <div style={{ padding: "1em", width: "80%", margin: "auto" }}>
            <div className="artistPageHeaderContainer">
              <div className="artistPageImageContainer">
                <img
                  src={
                    song.coverImage !== "undefined"
                      ? `${host}/${song.coverImage}`
                      : noArtistImage
                  }
                  className="artistImage"
                  alt="song"
                />
              </div>
              <div>
                <h1>{song.title}</h1>
                <p>
                  {song.album} by{" "}
                  {song.artists &&
                    song.artists.map((currArtist, currArtistIndex) => {
                      return (
                        <Link
                          to={`/artists/${currArtist._id}`}
                          key={currArtist._id}
                        >
                          {currArtist.name}
                          {currArtistIndex !== song.artists.length - 1
                            ? ", "
                            : ""}
                        </Link>
                      );
                    })}
                </p>
                <p>Plays: {song.playCount}</p>
                <div className="artistActions">
                  <button
                    className="btn artistActionButton"
                    onClick={() => {
                      if (!currSong || song._id !== currSong._id) {
                        play(song);
                        playbtnAddToQueue(song);
                      }
                    }}
                  >
                    Play
                  </button>
                  <button className="btn artistActionButton">Like</button>
                </div>
              </div>
            </div>
            {songAlbum && (
              <div>
                <h1>More Like This</h1>
                <table className="artistPageTable">
                  <tbody>
                    {songAlbum.map((ele, index) => {
                      return (
                        <tr className="artistPageTableRow" key={ele._id}>
                          <td className="artistPageTableCell">{index + 1}.</td>
                          <td className="artistPageSongDetails">
                            <div
                              className="artistPageSongCoverImageContainer"
                              onClick={() => {
                                if (!currSong || ele._id !== currSong._id) {
                                  play(ele);
                                  playbtnAddToQueue(ele);
                                }
                              }}
                            >
                              {currSong && ele._id === currSong._id ? (
                                <>
                                  <img
                                    src={PlayingBarGif}
                                    className="queue-playing-image"
                                    alt="play button"
                                  />
                                </>
                              ) : (
                                <span className="artistPageSongCoverPlayIcon">
                                  <IoIosPlayCircle />
                                </span>
                              )}
                              <img
                                src={`${host}/${ele.coverImage}`}
                                className="artistPageSongCoverImage"
                                alt={ele.title}
                              />
                            </div>
                            <p>{ele.title}</p>
                          </td>
                          <td className="artistPageTableCell">
                            {ele.artists &&
                              ele.artists.map((currArtist, currArtistIndex) => {
                                return (
                                  <Link
                                    to={`/artists/${currArtist._id}`}
                                    key={currArtist._id}
                                  >
                                    {currArtist.name}
                                    {currArtistIndex !== ele.artists.length - 1
                                      ? ", "
                                      : ""}
                                  </Link>
                                );
                              })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
