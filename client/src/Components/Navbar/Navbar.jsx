import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/images/miscellaneous/logo.png";
import { Link } from "react-router-dom";
import AppsButton from "./AppsButton/AppsButton";
import UserProfileButton from "./UserProfileButton";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Cookies from "js-cookie";

export default function Navbar() {
  const navbar = useRef();
  useEffect(() => {
    const ele = document.querySelector("#root").children[1].children[0];
    ele.addEventListener("scroll", (e) => {
      if (ele.scrollTop > navbar.current.offsetHeight) {
        navbar.current.style.backdropFilter = "blur(20px)";
      } else {
        navbar.current.style.backdropFilter = "";
      }
    });
  }, []);

  const [username, setUsername] = useState(
    Cookies.get("username") || "Guest User"
  );
  const [userAvatar, setUserAvatar] = useState(Cookies.get("userAvatar") || "");

  // Update state whenever cookie changes
  useEffect(() => {
    const handleCookieChange = () => {
      setUsername(Cookies.get("username") || "Guest User");
      setUserAvatar(Cookies.get("userAvatar") || "");
    };

    // Add event listener for cookie changes
    window.addEventListener("cookies", handleCookieChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("cookies", handleCookieChange);
    };
  }, []);

  const hamburgerSlave = useRef();
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const [isMobile] = useState(isMobileDevice());
  return (
    <>
      <div className="navbar" ref={navbar}>
        <Link to="/">
          <div className="navbar-logo">
            <img src={logo} alt="logo" className="navbar-logo-image" />
            <span className="navbar-title">RAAHI BEATS</span>
          </div>
        </Link>

        <div
          className={`navbar-options-section  ${isMobile ? "hide" : ""}`}
          ref={hamburgerSlave}
        >
          <form className="search-area">
            <div className="search-input-area">
              <input
                placeholder="What's on your mind..."
                className="search-input"
              />
            </div>
            <div className="search-icon">
              <FaSearch />
            </div>
          </form>
          <div className="navbar-icon-container">
            <AppsButton />
            <UserProfileButton username={username} userAvatar={userAvatar} />
          </div>
        </div>
        <span
          className="nav-hamburger-menu"
          onClick={() => {
            if (hamburgerSlave.current.classList.contains("hide")) {
              hamburgerSlave.current.classList.remove("hide");
              hamburgerSlave.current.style.height = "100vh";
            } else {
              hamburgerSlave.current.classList.add("hide");
              hamburgerSlave.current.style.height = "";
            }
          }}
        >
          <GiHamburgerMenu />
        </span>
      </div>
    </>
  );
}
