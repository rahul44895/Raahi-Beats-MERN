import React, { useCallback, useContext, useEffect, useState } from "react";
import { ArtistContext } from "../../Context/Artists/ArtistState";
import artistVideoBg from "../../assets/video/artistSec1.mp4";
import "./artistStyle.css";

export default function Artists() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { fetchArtists } = useContext(ArtistContext);
  const [artists, setArtists] = useState(null);
  const host = process.env.REACT_APP_HOST;

  const handleArtistFetch = useCallback(async () => {
    const response = await fetchArtists();
    setArtists(response);
  }, [fetchArtists, setArtists]);

  useEffect(() => {
    handleArtistFetch();
  }, [handleArtistFetch]);

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
                <center>All Artists</center>
              </h1>
            </div>
            {artists && artists.length > 0 && (
              <div className="artist-card-container">
                {artists.map((currArtist) => {
                  return (
                    <div
                      key={currArtist._id}
                      className="artist-card"
                      onClick={async() => {
                        console.log(await fetchArtists(currArtist._id))
                      }}
                    >
                      <div className="artist-card-image-container">
                        <img
                          src={`${host}/${currArtist.avatar}`}
                          className="artist-card-image"
                          alt="artistavatar"
                        />
                      </div>
                      <div className="artist-card-name">{currArtist.name}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
