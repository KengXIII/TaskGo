import React from "react";
import { SidebarData } from "./SidebarData";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, key) => {
          return (
            <li key={key}>
              <Link
                to={val.link}
                className="row"
                style={{ textDecoration: "none" }}
              >
                <div id="icon">{val.icon}</div>
                <div id="title">{val.title}</div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        style={{ textAlign: "center", fontSize: "0.9em", marginTop: "auto" }}
      >
        <a
          style={{ color: "lightgrey" }}
          href="https://docs.google.com/forms/d/e/1FAIpQLSdPLMzPWKYqJw00sY-VoghRY3tdVOOKJAm1UoleRr-rJWYVuw/viewform?usp=sf_link"
          rel="noreferrer"
          target="_blank"
        >
          Leave us a feedback!
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
