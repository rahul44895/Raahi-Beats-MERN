import "./App.css";
import "./fonts.css";
import Home from "./Components/Home/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import SongState from "./Context/Songs/SongState";
import AudioState from "./Context/Audio/AudioState";
import AuthenticationState from "./Context/Authentication/AuthenticationState";
import LoginPage from "./Components/Authentication/LoginPage";
import SignUp from "./Components/Authentication/SignUp";
import { Route, Routes } from "react-router-dom";
import BottomControls from "./Components/ControlArea/BottomControls";
import SongDetailsPage from "./Components/SongDetailsPage/SongDetailsPage";
import PlaylistDialogue from "./Components/PlaylistDialogue/PlaylistDialogue";
import AlertState from "./Context/Alert/AlertState";
import SideNav from "./Components/SideNav/SideNav";
import AllSongs from "./Components/Home/Sections/AllSongs";
import PlaylistState from "./Context/Playlist/PlaylistState";
import ArtistState from "./Context/Artists/ArtistState";
import ShareState from "./Context/Share/ShareState";
import Artists from "./Components/Artists/Artists";
import ParticularArtist from "./Components/Artists/ParticularArtist";
import FullScreen from "./Components/FullScreen/FullScreen";
import ShareDialogue from "./Components/ShareDialgoue/ShareDialogue";

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
  const [showFullScreen, setShowFullScreen] = useState(false);

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
        <SongState>
          <AudioState>
            <ArtistState>
              <PlaylistState>
                <ShareState>
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
                            path="/song/:songID"
                            element={<SongDetailsPage />}
                          />
                          <Route exact path="/login" element={<LoginPage />} />
                          <Route exact path="/signup" element={<SignUp />} />
                          <Route
                            exact
                            path="/allsongs"
                            element={<AllSongs />}
                          />
                          <Route exact path="/artists" element={<Artists />} />
                          <Route
                            exact
                            path="/artists/:id"
                            element={<ParticularArtist />}
                          />
                          <Route
                            path="*"
                            element={
                              <div className="homeContainer">404 not found</div>
                            }
                          />
                        </Routes>
                        <div
                          style={{
                            height: `${showFullScreen ? "100%" : ""}`,
                            display: "flex",
                            flexDirection: "column",
                            overflow: `${showFullScreen ? "hidden" : "auto"}`,
                          }}
                        >
                          {showFullScreen && (
                            <FullScreen setShowFullScreen={setShowFullScreen} />
                          )}
                          <BottomControls
                            showFullScreen={showFullScreen}
                            setShowFullScreen={setShowFullScreen}
                          />
                        </div>
                      </div>
                      <ShareDialogue />
                      <PlaylistDialogue />
                    </>
                  )}
                </ShareState>
              </PlaylistState>
            </ArtistState>
          </AudioState>
        </SongState>
      </AuthenticationState>
    </AlertState>
  );
}

export default App;
