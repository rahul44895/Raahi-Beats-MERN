import React, { useEffect, useState } from "react";
import bgVideo from "../../assets/video/bg-video.54d189c7(2323).mp4";
import "./HomePage.css";
import NewReleases from "./Sections/NewReleases";
import OldReleases from "./Sections/OldReleases";
import UrbanPunjabiTadka from "./Sections/UrbanPunjabiTadka";
import WestTunes from "./Sections/WestTunes";


export default function HomePage() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  return (
    <div className="homeContainer scroll-container">
      
      <div className="fullscreen-container scroll-item">
        {
          <video
            src={bgVideo}
            muted
            autoPlay
            loop
            className="fullscreen-video"
            onError={() => alert("Some error occured")}
          ></video>
        }

        <div className="overlay-text">
          <span>NEW SINGLE</span>
          <h1>Feel the heart beats</h1>
          <p>
            Elevate your senses through the power of sound
            <br />
            Discover the soundtrack to your life
          </p>
        </div>
        <div className="video-overlay"></div>
      </div>
      <NewReleases range={10} navbarHeight={navbarHeight} />
      <OldReleases range={10} navbarHeight={navbarHeight} />
      <UrbanPunjabiTadka range={10} navbarHeight={navbarHeight} />
      <WestTunes range={10} navbarHeight={navbarHeight} />
      Most Liked Song of this week Most Played Song of this week Most shared
      song
    </div>
  );
}
