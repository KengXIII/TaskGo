import React from "react";
import { SidebarData } from "./SidebarData";
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              // id={ useLocation() === val.link ? "active" : ""}
            >
              <Link to={val.link} className="row" style={{textDecoration: "none"}}>
                <div id="icon">{val.icon}</div>
                <div id="title">{val.title}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
