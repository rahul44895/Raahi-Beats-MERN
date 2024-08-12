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
import PlaylistDialogueState from "./Context/Playlist/PlaylistDialogueState";
import PlaylistDialogue from "./Components/PlaylistDialogue/PlaylistDialogue";
import AlertState from "./Context/Alert/AlertState";
import SideNav from "./Components/SideNav/SideNav";

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
            <PlaylistDialogueState>
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
                      {/* <Route exact path="/" element={<div>Home section is commented</div>} /> */}
                      <Route
                        path="/details/:song"
                        element={<SongDetailsPage />}
                      />
                      <Route exact path="/login" element={<LoginPage />} />
                    </Routes>

                    <BottomControls />
                    <PlaylistDialogue />
                  </div>
                </>
              )}
            </PlaylistDialogueState>
          </SongState>
        </AudioState>
      </AuthenticationState>
    </AlertState>
  );
}

export default App;
