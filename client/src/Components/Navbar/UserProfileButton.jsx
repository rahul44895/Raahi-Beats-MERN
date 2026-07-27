import React, { useContext } from "react";
import "../Navbar/AppsButton/AppsButton.css";
import raahi_beats_logo from "../../assets/images/Apps/raahi-beats-logo.png";
import { Link, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../../Context/Authentication/AuthenticationState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LAZY_IMAGE_WRAPPER_PROPS = { style: { transitionDelay: "0.5s" } };

export default function UserProfileButton({
  username,
  userAvatar,
  handleNavVisibility,
}) {
  const { logout } = useContext(AuthenticationContext);
  const host = process.env.REACT_APP_HOST;
  const location = useLocation();

  return (
    <div className="nav-menu-dropdown">
      <div className="nav-menu-button">
        <LazyLoadImage
          src={userAvatar ? `${host}/${userAvatar}` : raahi_beats_logo}
          className="nav-menu-dropdown-icon"
          alt="user-avatar"
          effect="blur"
          wrapperProps={LAZY_IMAGE_WRAPPER_PROPS}
        />
      </div>
      <div className="nav-menu-container">
        <div style={{ textAlign: "center" }}>
          <LazyLoadImage
            src={userAvatar ? `${host}/${userAvatar}` : raahi_beats_logo}
            className="nav-menu-dropdown-icon"
            alt="user-avatar"
            style={{ height: "100px", width: "100px", marginBottom: "10px" }}
            effect="blur"
            wrapperProps={LAZY_IMAGE_WRAPPER_PROPS}
          />
          <p style={{ marginBottom: "10px", color: "black" }}>{username}</p>
          {!userAvatar && (
            <div>
              <Link
                to="/login"
                onClick={() => {
                  localStorage.setItem("redirectPath", location.pathname);
                  handleNavVisibility();
                }}
              >
                <button className="btn">Login</button>
              </Link>
              <br />
              <Link
                to="/signup"
                onClick={() => {
                  localStorage.setItem("redirectPath", location.pathname);
                  handleNavVisibility();
                }}
                >
                <button className="btn">SignUp</button>
              </Link>
            </div>
          )}

          {userAvatar && (
            <div
            onClick={() => {
              logout();
              handleNavVisibility();
              }}
            >
              <button className="btn">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
