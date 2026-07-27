import "./App.css";
import "./mediaqueries/mediaquery.css";
import "./fonts.css";
import { useEffect, useState, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import SongState from "./Context/Songs/SongState";
import AudioState from "./Context/Audio/AudioState";
import AuthenticationState from "./Context/Authentication/AuthenticationState";
import BottomControls from "./Components/ControlArea/BottomControls";
import PlaylistDialogue from "./Components/PlaylistDialogue/PlaylistDialogue";
import AlertState from "./Context/Alert/AlertState";
import SideNav from "./Components/SideNav/SideNav";
import PlaylistState from "./Context/Playlist/PlaylistState";
import ArtistState from "./Context/Artists/ArtistState";
import ShareState from "./Context/Share/ShareState";
import FullScreen from "./Components/FullScreen/FullScreen";
import ShareDialogue from "./Components/ShareDialgoue/ShareDialogue";
import ProtectedRoute from "./Components/ProtectedRoute";

// Home ("/") is kept eager since almost every visit lands there first - lazy-loading
// the landing route would add a network round-trip to the very first thing users see.
// Every other route is lazy so its code only downloads when actually visited.
const LoginPage = lazy(() => import("./Components/Authentication/LoginPage"));
const SignUp = lazy(() => import("./Components/Authentication/SignUp"));
const SongDetailsPage = lazy(() =>
  import("./Components/SongDetailsPage/SongDetailsPage")
);
const AllSongs = lazy(() => import("./Components/Home/Sections/AllSongs"));
const Artists = lazy(() => import("./Components/Artists/Artists"));
const ParticularArtist = lazy(() =>
  import("./Components/Artists/ParticularArtist")
);
const PlaylistMain = lazy(() =>
  import("./Components/PlaylistPage/PlaylistMain")
);
const PlaylistDetails = lazy(() =>
  import("./Components/PlaylistPage/PlaylistDetails")
);
const SearchPage = lazy(() => import("./Components/SearchPage/SearchPage"));
const ChatApp = lazy(() => import("./Components/ChatApplication/ChatApp"));
const LikedSongsPage = lazy(() =>
  import("./Components/LikedSongsPage/LikedSongsPage")
);

const routeLoadingFallback = (
  <div
    className="homeContainer"
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <p>Loading...</p>
  </div>
);

function App() {
  const [portrait, setPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const [isMobile] = useState(isMobileDevice());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [windowHeight, setwindowHeight] = useState(window.innerHeight);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  const [isFullScreenVisible, setFullScreenVisible] = useState(false);

  // HANDLES DEVICE ONLINE/OFFLINE STATUS
  useEffect(() => {
    // Handler for online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    // Add event listeners for online and offline events
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  // HANDLEs DEVICE RESIZE
  useEffect(() => {
    let ticking = false;
    const updateDimensions = () => {
      setPortrait(window.innerHeight > window.innerWidth);
      setwindowHeight(window.innerHeight);
      setwindowWidth(window.innerWidth);
      ticking = false;
    };
    const handleResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateDimensions);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // HANDLES MOBILE DEVICE REFRESH
  useEffect(() => {
    if (window.innerWidth < 1000) {
      const handleBeforeUnload = (event) => {
        // Prevent default behavior (refresh without confirmation)
        event.preventDefault();
        event.returnValue = ""; // Chrome requires returnValue to be set
      };

      // Add the event listener when component mounts
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup the event listener when component unmounts
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  // SEND DEVICE DIMENSIONS TO BACKEND
  useEffect(() => {
    const temp = async () => {
      await fetch(`${process.env.REACT_APP_HOST}/deviceDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: window.innerHeight,
          width: window.innerWidth,
        }),
      });
    };
    temp();
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
                  {(!isMobile || (isMobile && portrait)) &&
                    (isOnline ? (
                      <>
                        <Navbar />
                        <SideNav />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            height: `${windowHeight - 1}px`,
                            width: `${windowWidth - 1}px`,
                          }}
                        >
                          <Suspense fallback={routeLoadingFallback}>
                          <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route
                              path="/song/:songName/:songID"
                              element={<SongDetailsPage />}
                            />
                            <Route
                              exact
                              path="/login"
                              element={<LoginPage />}
                            />
                            <Route exact path="/signup" element={<SignUp />} />
                            <Route
                              exact
                              path="/allsongs"
                              element={<AllSongs />}
                            />
                            <Route
                              exact
                              path="/artists"
                              element={<Artists />}
                            />
                            <Route
                              exact
                              path="/artists/:artistName/:artistID"
                              element={<ParticularArtist />}
                            />
                            <Route
                              exact
                              path="/playlist"
                              element={<PlaylistMain />}
                            />
                            <Route
                              exact
                              path="/playlist/:playlistID"
                              element={<PlaylistDetails />}
                            />
                            <Route
                              exact
                              path="/search/:searchQuery"
                              element={<SearchPage />}
                            />
                            <Route
                              exact
                              path="/chat"
                              element={<ProtectedRoute element={<ChatApp />} />}
                            />

                            <Route
                              exact
                              path="/liked"
                              element={<LikedSongsPage />}
                            />

                            <Route
                              path="*"
                              element={
                                <div
                                  className="homeContainer"
                                  style={{
                                    height: "100vh",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <h1>404</h1>
                                  <h3>PAGE NOT_FOUND</h3>
                                </div>
                              }
                            />
                          </Routes>
                          </Suspense>

                          <div
                            style={{
                              position: `${isFullScreenVisible ? "fixed" : ""}`,
                              zIndex: `${isFullScreenVisible ? "1000" : ""}`,
                              inset: `${isFullScreenVisible ? "0" : ""}`,
                              height: `${isFullScreenVisible ? "100%" : ""}`,
                              display: `${isFullScreenVisible ? "flex" : ""}`,
                              flexDirection: `${
                                isFullScreenVisible ? "column" : ""
                              }`,
                              overflow: `${
                                isFullScreenVisible ? "hidden" : ""
                              }`,
                            }}
                          >
                            {isFullScreenVisible && (
                              <FullScreen
                                setFullScreenVisible={setFullScreenVisible}
                              />
                            )}

                            <BottomControls
                              isFullScreenVisible={isFullScreenVisible}
                              setFullScreenVisible={setFullScreenVisible}
                            />
                          </div>
                        </div>
                        <ShareDialogue />
                        <PlaylistDialogue />
                      </>
                    ) : (
                      <div
                        className="homeContainer"
                        style={{ height: "100vh" }}
                      >
                        Offline
                      </div>
                    ))}
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
