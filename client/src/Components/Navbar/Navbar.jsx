import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/images/miscellaneous/logo.png";
import { Link, useNavigate } from "react-router-dom";
import AppsButton from "./AppsButton/AppsButton";
import UserProfileButton from "./UserProfileButton";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Cookies from "js-cookie";

export default function Navbar() {
  const navbar = useRef();
  useEffect(() => {
    const ele = document.querySelector("#root").children[1].children[0];
    if (ele) {
      ele.addEventListener("scroll", (e) => {
        if (ele.scrollTop > navbar.current.offsetHeight) {
          navbar.current.style.backdropFilter = "blur(20px)";
        } else {
          navbar.current.style.backdropFilter = "";
        }
      });
    }
  }, []);
  let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [username, setUsername] = useState(user ? user.username : "Guest User");
  const [userAvatar, setUserAvatar] = useState(user ? user.avatar : null);
  // Update state whenever cookie changes
  useEffect(() => {
    const handleCookieChange = () => {
      let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
      setUsername(user ? user.username : "Guest User");
      setUserAvatar(user ? user.avatar : null);
    };
    // Add event listener for cookie changes
    window.addEventListener("cookies", handleCookieChange);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("cookies", handleCookieChange);
    };
  });

  const navbarOptionsSection = useRef(null);
  const [searchQuery, setsearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery === "") return;
    let searchURI = encodeURIComponent(searchQuery);
    navigate(`/search?=${searchURI}`);
    handleNavVisibility();
  };

  const handleNavVisibility = () => {
    navbarOptionsSection.current.style.display !== "flex"
      ? (navbarOptionsSection.current.style.display = "flex")
      : (navbarOptionsSection.current.style.display = "");
  };
  return (
    <>
      <div className="navbar" ref={navbar}>
        <div className="navtemp">
          <Link to="/">
            <div className="navbar-logo">
              <img src={logo} alt="logo" className="navbar-logo-image" />
              <span className="navbar-title">RAAHI BEATS</span>
            </div>
          </Link>
          <span
            className="nav-hamburger-menu"
            onClick={() => handleNavVisibility()}
          >
            <GiHamburgerMenu />
          </span>
        </div>

        <div className={`navbar-options-section `} ref={navbarOptionsSection}>
          <form className="search-area" onSubmit={handleSubmit}>
            <div className="search-input-area">
              <input
                placeholder="What's on your mind..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setsearchQuery(e.target.value)}
              />
            </div>
            <div className="search-icon">
              <FaSearch />
            </div>
          </form>
          <div className="navbar-icon-container">
            <AppsButton />
            <UserProfileButton
              username={username}
              userAvatar={userAvatar}
              handleNavVisibility={handleNavVisibility}
            />
          </div>
        </div>
      </div>
    </>
  );
}
