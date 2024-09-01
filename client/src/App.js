import "./App.css";
import "./fonts.css";
import Home from "./Components/Home/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import SongState from "./Context/Songs/SongState";
import AudioState from "./Context/Audio/AudioState";
import AuthenticationState from "./Context/Authentication/AuthenticationState";
import LoginPage from "./Components/Authentication/LoginPage";
import { Route, Routes } from "react-router-dom";
import BottomControls from "./Components/ControlArea/BottomControls";
import SongDetailsPage from "./Components/SongDetailsPage/SongDetailsPage";
import PlaylistDialogue from "./Components/PlaylistDialogue/PlaylistDialogue";
import AlertState from "./Context/Alert/AlertState";
import SideNav from "./Components/SideNav/SideNav";
import AllSongs from "./Components/Home/Sections/AllSongs";
import PlaylistState from "./Context/Playlist/PlaylistState";
import ArtistState from "./Context/Artists/ArtistState";
import Artists from "./Components/Artists/Artists";

function App() {
  const [portrait, setPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const [isMobile] = useState(isMobileDevice());
  const [windowHeight, setwindowHeight] = useState(window.innerHeight);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setPortrait(window.innerHeight > window.innerWidth);
      setwindowHeight(window.innerHeight);
      setwindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AlertState>
      <AuthenticationState>
        <AudioState>
          <SongState>
            <ArtistState>
              <PlaylistState>
                {isMobile && !portrait && (
                  <div className="landscape-warning">
                    You can use this website only on portrait modes
                  </div>
                )}
                {(!isMobile || (isMobile && portrait)) && (
                  <>
                    <Navbar />
                    <SideNav />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: `${windowHeight}px`,
                        width: `${windowWidth}px`,
                      }}
                    >
                      <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route
                          path="/details/:song"
                          element={<SongDetailsPage />}
                        />
                        <Route exact path="/login" element={<LoginPage />} />
                        <Route exact path="/allsongs" element={<AllSongs />} />
                        <Route exact path="/artists" element={<Artists />} />
                      </Routes>

                      <BottomControls />
                    </div>
                    <PlaylistDialogue />
                  </>
                )}
              </PlaylistState>
            </ArtistState>
          </SongState>
        </AudioState>
      </AuthenticationState>
    </AlertState>
  );
}

export default App;
