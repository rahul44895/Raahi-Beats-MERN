import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArtistContext } from "../../Context/Artists/ArtistState";
import { AudioContext } from "../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";
import "./ParticularPageStyle.css";
import PlayingBarGif from "../../assets/images/miscellaneous/playingBarGif.gif";
import noArtistImage from "../../assets/images/miscellaneous/no-artist-image.jpg";

export default function ParticularArtist() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { fetchArtists } = useContext(ArtistContext);
  const { play, playbtnAddToQueue, addPlaylistToQueue, currSong } =
    useContext(AudioContext);

  const { id } = useParams();
  const host = process.env.REACT_APP_HOST;
  const [artist, setArtist] = useState(null);
  useEffect(() => {
    const fetchArtist = async () => {
      if (id) {
        const response = await fetchArtists({ artistID: id });
        setArtist(response);
        // console.log(response);
      }
    };
    fetchArtist();
  }, [id, fetchArtists]);

  return (
    <div className="homeContainer">
      <div style={{ height: `${navbarHeight}px` }}></div>
      {artist ? (
        <div style={{ padding: "1em", width: "80%", margin: "auto" }}>
          <div className="artistPageHeaderContainer">
            <div className="artistPageImageContainer">
              <img
                src={
                  artist.avatar !== "undefined"
                    ? `${host}/${artist.avatar}`
                    : noArtistImage
                }
                className="artistImage"
                alt="artist avatar"
              />
            </div>
            <div>
              <h1>{artist.name}</h1>
              <p>Listeners: {artist.playedCount}</p>
              <div className="artistActions">
                <button
                  className="btn artistActionButton"
                  onClick={() => addPlaylistToQueue(artist.songs)}
                >
                  Play
                </button>
                <button className="btn artistActionButton">Like</button>
              </div>
            </div>
          </div>
          <div>
            <table className="artistPageTable">
              <tbody>
                {artist.songs.map((ele, index) => {
                  return (
                    <tr className="artistPageTableRow" key={index}>
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
                        <Link to={`/song/${ele._id}`}>
                          {" "}
                          <p>{ele.title}</p>
                        </Link>
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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
