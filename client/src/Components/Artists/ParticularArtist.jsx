import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ParticularPageStyle.css";
import { ArtistContext } from "../../Context/Artists/ArtistState";
import { AudioContext } from "../../Context/Audio/AudioState";
import { IoIosPlayCircle } from "react-icons/io";
import PlayingBarGif from "../../assets/images/miscellaneous/playingBarGif.gif";
import noArtistImage from "../../assets/images/miscellaneous/no-artist-image.jpg";
import useNavbarHeight from "../../hooks/useNavbarHeight";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LAZY_IMAGE_WRAPPER_PROPS = { style: { transitionDelay: "0.5s" } };

export default function ParticularArtist() {
  const navbarHeight = useNavbarHeight();

  const { fetchArtists } = useContext(ArtistContext);
  const { play, playbtnAddToQueue, addPlaylistToQueue, currSong } =
    useContext(AudioContext);

  const { artistName, artistID } = useParams();
  const host = process.env.REACT_APP_HOST;
  const [artist, setArtist] = useState(null);
  useEffect(() => {
    const fetchArtist = async () => {
      if (artistName && artistID) {
        const response = await fetchArtists({
          artistShortID: `${artistName}/${artistID}`,
        });
        setArtist(response);
      }
    };
    fetchArtist();
  }, [artistName, artistID, fetchArtists]);

  return (
    <div className="homeContainer">
      <div style={{ height: `${navbarHeight}px` }}></div>
      {artist ? (
        <div style={{ padding: "1em", width: "80%", margin: "auto" }}>
          <div className="artistPageHeaderContainer">
            <div className="artistPageImageContainer">
              <LazyLoadImage
                src={
                  artist.avatar !== "undefined"
                    ? `${host}/${artist.avatar}`
                    : noArtistImage
                }
                className="artistImage"
                alt="artist avatar"
                effect="blur"
                wrapperProps={LAZY_IMAGE_WRAPPER_PROPS}
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

          <div className="artistPage-row-container">
            {artist.songs.map((ele, index) => {
              return (
                <div key={index} className="artistPage-row">
                  <div className="artistPage-index">{index + 1}.</div>
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
                    <LazyLoadImage
                      src={`${host}/${ele.coverImage}`}
                      className="artistPageSongCoverImage"
                      alt={ele.title}
                      effect="blur"
                      wrapperProps={LAZY_IMAGE_WRAPPER_PROPS}
                    />
                  </div>
                  <div className="artistPage-infoContainer">
                    <div className="artistPage-title">
                      <Link to={`/song/${ele.shortenURL}`}>
                        <p>{ele.title}</p>
                      </Link>
                    </div>
                    <div className="artistPage-artistList">
                      {ele.artists &&
                        ele.artists.map((currArtist, currArtistIndex) => {
                          return (
                            <Link
                              to={`/artists/${currArtist.shortenURL}`}
                              key={currArtist._id}
                            >
                              {currArtist.name}
                              {currArtistIndex !== ele.artists.length - 1
                                ? ", "
                                : ""}
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
