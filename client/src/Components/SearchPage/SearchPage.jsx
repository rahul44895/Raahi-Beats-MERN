import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SongContext } from "../../Context/Songs/SongState";
import SongCardXL from "../Home/Sections/SongCardXL";
import { ArtistContext } from "../../Context/Artists/ArtistState";
import noArtistImage from "../../assets/images/miscellaneous/no-artist-image.jpg";

export default function SearchPage() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { fetchSongs } = useContext(SongContext);
  const { fetchArtists } = useContext(ArtistContext);

  const { searchQuery } = useParams();
  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;

  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = useCallback(async () => {
    let response = await fetchSongs(searchQuery);
    if (response.length > 0) {
      setSearchResults((prevResults) => ({
        ...prevResults,
        songs: response,
      }));
    }

    response = await fetchArtists({ artistShortID: searchQuery });
    if (
      (Array.isArray(response) && response.length > 0) ||
      response.length !== 0
    ) {
      setSearchResults((prevResults) => ({
        ...prevResults,
        artists: response,
      }));
    }
  }, [searchQuery, fetchSongs, fetchArtists, setSearchResults]);

  useEffect(() => {
    if (!searchQuery) navigate("/error");
    handleSearch();
  }, [navigate, searchQuery, handleSearch]);
  return (
    <div className="homeContainer">
      <div style={{ height: `${navbarHeight}px` }}></div>
      <div style={{ padding: "2em" }}>
        {searchQuery ? (
          <div>
            {searchResults ? (
              <>
                {searchResults.songs && (
                  <div>
                    <h1>Songs</h1>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {searchResults.songs.map((currSong) => {
                        return (
                          <SongCardXL key={currSong._id} song={currSong} />
                        );
                      })}
                    </div>
                  </div>
                )}
                {searchResults.artists && (
                  <div>
                    <h1>Artists</h1>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {Array.isArray(searchResults.artists) ? (
                        searchResults.artists.map((currArtist) => {
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
                        <Link
                          to={`/artists/${searchResults.artists.shortenURL}`}
                          key={searchResults.artists._id}
                        >
                          <div className="artist-card">
                            <div className="artist-card-image-container">
                              {searchResults.artists.avatar !== "undefined" ? (
                                <img
                                  src={`${host}/${searchResults.artists.avatar}`}
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
                              {searchResults.artists.name}
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
        ) : (
          <div>This page cannot be accessed.</div>
        )}
      </div>
    </div>
  );
}
