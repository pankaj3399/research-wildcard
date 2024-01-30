import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import '../App.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="Sidebar">
      <div className="logo">
        <img src="/datasky_logo.png" alt="logo" />
      </div>
      <ul className="SidebarList">
        {SidebarData.map((val, key) => (
          <li key={key} className="row">
            <NavLink
              to={val.link}
              className="nav-link"
              activeClassName="active"
              isActive={() => val.link === location.pathname}
            >
              <div className="nav-icon">{val.icon}</div>
              <div className="nav-title">{val.title}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Sidebar;
