import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArtistContext } from "../../Context/Artists/ArtistState";
import artistVideoBg from "../../assets/video/artistSec1.mp4";
import noArtistImage from "../../assets/images/miscellaneous/no-artist-image.jpg";
import "./artistStyle.css";

export default function Artists() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { fetchArtists } = useContext(ArtistContext);
  const [topArtists, setTopArtists] = useState(null);
  const [allArtists, setAllArtists] = useState(null);
  const host = process.env.REACT_APP_HOST;

  useEffect(() => {
    const handleTopArtistFetch = async () => {
      const response = await fetchArtists({ countOfArtists: 10 });
      if (response) setTopArtists(response);
    };

    const handleArtistFetch = async () => {
      const response = await fetchArtists({});
      if (response) setAllArtists(response);
    };
    handleTopArtistFetch();
    handleArtistFetch();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div style={{ flex: "1", overflow: "auto" }} className="scroll-container">
        <div className="fullscreen-container scroll-item">
          <video
            src={artistVideoBg}
            muted
            autoPlay
            loop
            className="fullscreen-video"
            onError={() => alert("Some error occured")}
          ></video>
        </div>

        <div
          className="h-100vh-min scroll-item artist-sec-2"
          style={{
            position: "relative",
          }}
        >
          <div className="artist-sec-2-subsec">
            <div className="artist-sec-2-subsec-image-container">
              <img
                src={require("../../assets/images/miscellaneous/artist.webp")}
                alt="artistGuitar"
              />
            </div>
            <div className="artist-sec-2-subsec-text">
              <p>
                <span>Notes as whispers, melodies as dreams</span>— where a
                music artist paints emotion with the magic of sound
              </p>
            </div>
          </div>
          <div className="artist-sec-2-subsec-2">
            <div style={{ height: `${navbarHeight}px`, width: "100vw" }}>
              <h1 style={{ fontFamily: "'Dancing Script', cursive" }}>
                <center>Top Artists</center>
              </h1>
            </div>
            {
              <div className="artist-card-container">
                {topArtists && topArtists.length > 0 ? (
                  topArtists.map((currArtist) => {
                    return (
                      <Link
                        to={`/artists/${currArtist.shortenURL}`}
                        key={currArtist._id}
                      >
                        <div className="artist-card">
                          <div className="artist-card-image-container">
                            {currArtist.avatar !== "undefined" ? (
                              <img
                                src={`${host}/${currArtist.avatar}`}
                                className="artist-card-image"
                                alt="artistavatar"
                              />
                            ) : (
                              <img
                                src={noArtistImage}
                                className="artist-card-image"
                                alt="artistavatar"
                              />
                            )}
                          </div>
                          <div className="artist-card-name">
                            {currArtist.name}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            }
            <div className="h-100vh-min scroll-item artist-sec-2">
              <div
                style={{ height: `${navbarHeight}px`, width: "100vw" }}
              ></div>
              <h1 style={{ fontFamily: "'Dancing Script', cursive" }}>
                <center>All Artists</center>
              </h1>

              <div className="artist-card-container">
                {allArtists && allArtists.length > 0 ? (
                  allArtists.map((currArtist) => {
                    return (
                      <Link
                        to={`/artists/${currArtist.shortenURL}`}
                        key={currArtist._id}
                      >
                        <div className="artist-card">
                          <div className="artist-card-image-container">
                            {currArtist.avatar !== "undefined" ? (
                              <img
                                src={`${host}/${currArtist.avatar}`}
                                className="artist-card-image"
                                alt="artistavatar"
                              />
                            ) : (
                              <img
                                src={noArtistImage}
                                className="artist-card-image"
                                alt="artistavatar"
                              />
                            )}
                          </div>
                          <div className="artist-card-name">
                            {currArtist.name}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
