import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Hoisted so it's a stable reference across renders/cards instead of a fresh
// object per card per render, which would defeat the React.memo below.
const LAZY_IMAGE_WRAPPER_PROPS = { style: { transitionDelay: "0.5s" } };

// Was duplicated 4x (twice in Artists.jsx, twice in SearchPage.jsx) with byte-identical markup.
function ArtistCard({ artist, host, noArtistImage }) {
  return (
    <Link to={`/artists/${artist.shortenURL}`}>
      <div className="artist-card">
        <div className="artist-card-image-container">
          <LazyLoadImage
            src={
              artist.avatar !== "undefined"
                ? `${host}/${artist.avatar}`
                : noArtistImage
            }
            className="artist-card-image"
            alt="artistavatar"
            effect="blur"
            wrapperProps={LAZY_IMAGE_WRAPPER_PROPS}
          />
        </div>
        <div className="artist-card-name">{artist.name}</div>
      </div>
    </Link>
  );
}

export default React.memo(ArtistCard);
