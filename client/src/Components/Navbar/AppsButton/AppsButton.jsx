import React from "react";
import "./AppsButton.css";
import { Link } from "react-router-dom";
import raahi_beats_logo from "../../../assets/images/Apps/raahi-beats-logo.png";

export default function AppsButton() {
  return (
    <div className="nav-menu-dropdown">
      <div className="nav-menu-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="25px"
          width="25px"
          viewBox="0 -960 960 960"
          fill="#e8eaed"
          style={{ pointerEvents: "none" }}
        >
          <path d="M217.33-133.33q-35.33 0-59.66-24.34-24.34-24.33-24.34-59.66 0-35.34 24.34-59.67 24.33-24.33 59.66-24.33 35.34 0 59.67 24.33t24.33 59.67q0 35.33-24.33 59.66-24.33 24.34-59.67 24.34Zm262.67 0q-35.33 0-59.67-24.34Q396-182 396-217.33q0-35.34 24.33-59.67 24.34-24.33 59.67-24.33T539.67-277Q564-252.67 564-217.33q0 35.33-24.33 59.66-24.34 24.34-59.67 24.34Zm262.67 0q-35.34 0-59.67-24.34-24.33-24.33-24.33-59.66 0-35.34 24.33-59.67t59.67-24.33q35.33 0 59.66 24.33 24.34 24.33 24.34 59.67 0 35.33-24.34 59.66-24.33 24.34-59.66 24.34ZM217.33-396q-35.33 0-59.66-24.33-24.34-24.34-24.34-59.67t24.34-59.67Q182-564 217.33-564q35.34 0 59.67 24.33 24.33 24.34 24.33 59.67T277-420.33Q252.67-396 217.33-396ZM480-396q-35.33 0-59.67-24.33Q396-444.67 396-480t24.33-59.67Q444.67-564 480-564t59.67 24.33Q564-515.33 564-480t-24.33 59.67Q515.33-396 480-396Zm262.67 0q-35.34 0-59.67-24.33-24.33-24.34-24.33-59.67T683-539.67Q707.33-564 742.67-564q35.33 0 59.66 24.33 24.34 24.34 24.34 59.67t-24.34 59.67Q778-396 742.67-396ZM217.33-658.67q-35.33 0-59.66-24.33-24.34-24.33-24.34-59.67 0-35.33 24.34-59.66 24.33-24.34 59.66-24.34 35.34 0 59.67 24.34 24.33 24.33 24.33 59.66 0 35.34-24.33 59.67t-59.67 24.33Zm262.67 0q-35.33 0-59.67-24.33Q396-707.33 396-742.67q0-35.33 24.33-59.66 24.34-24.34 59.67-24.34t59.67 24.34Q564-778 564-742.67q0 35.34-24.33 59.67-24.34 24.33-59.67 24.33Zm262.67 0q-35.34 0-59.67-24.33t-24.33-59.67q0-35.33 24.33-59.66 24.33-24.34 59.67-24.34 35.33 0 59.66 24.34 24.34 24.33 24.34 59.66 0 35.34-24.34 59.67-24.33 24.33-59.66 24.33Z" />
        </svg>
      </div>
      <div className="nav-menu-container">
        <Link to={"https://www.contacts.raahi.com"} target="_blank">
          <div className="nav-menu-dropdown-icon-container ">
            <img
              className="nav-menu-dropdown-icon"
              src={raahi_beats_logo}
              alt="raahi_beats_logo"
            />
            <div>Contacts</div>
          </div>
        </Link>
        <Link to={"https://www.ecommerce.raahi.com"} target="_blank">
          <div className="nav-menu-dropdown-icon-container ">
            <img
              className="nav-menu-dropdown-icon"
              src={raahi_beats_logo}
              alt="raahi_beats_logo"
            />
            <div>Ecommerce</div>
          </div>
        </Link>
        <Link to={"https://www.beats.raahi.com"} target="_blank">
          <div className="nav-menu-dropdown-icon-container ">
            <img
              className="nav-menu-dropdown-icon"
              src={raahi_beats_logo}
              alt="raahi_beats_logo"
            />
            <div>Beats</div>
          </div>
        </Link>

        <Link to={"https://www.videos.raahi.com"} target="_blank">
          <div className="nav-menu-dropdown-icon-container ">
            <img
              className="nav-menu-dropdown-icon"
              src={raahi_beats_logo}
              alt="raahi_beats_logo"
            />
            <div>Videos</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
