import React, { useContext } from "react";
import "../Navbar/AppsButton/AppsButton.css";
import raahi_beats_logo from "../../assets/images/Apps/raahi-beats-logo.png";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../../Context/Authentication/AuthenticationState";

export default function UserProfileButton({ username, userAvatar }) {
  const { logout } = useContext(AuthenticationContext);
  const host = process.env.REACT_APP_HOST;
  return (
    <div className="nav-menu-dropdown">
      <div className="nav-menu-button">
        <img
          src={userAvatar ? `${host}/${userAvatar}` : raahi_beats_logo}
          className="nav-menu-dropdown-icon"
          alt="user-avatar"
        />
      </div>
      <div className="nav-menu-container">
        <div style={{ textAlign: "center" }}>
          <img
            src={raahi_beats_logo}
            className="nav-menu-dropdown-icon"
            alt="user-avatar"
            style={{ height: "100px", width: "100px", marginBottom: "10px" }}
          />
          <p style={{ marginBottom: "10px" }}>{username}</p>

          {!userAvatar && (
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
          )}
          {userAvatar && (
            <div onClick={logout}>
              <button className="btn">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
