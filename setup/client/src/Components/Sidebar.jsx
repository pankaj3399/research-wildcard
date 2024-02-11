import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import '../App.css';

function Sidebar() {
  const { pathname } = useLocation();

  // Condition to check if the current pathname is for the Title Abstract page
  const isTitleAbstractPage = pathname.startsWith('/titleabstract');

  if (isTitleAbstractPage) {
    return null; // Don't render the Sidebar on the Title Abstract page
  }

  return (
    <div className="Sidebar">
      <div className="logo">
        <img src="/datasky_logo.png" alt="logo" />
      </div>
      <ul className="SidebarList">
        {SidebarData.map((val, key) => (
          <li key={key} className={pathname === val.link ? "row active" : "row"}>
            <NavLink
              to={val.link}
              className="nav-link"
              // Remove activeClassName since it's not supported in v6, use inline style or className logic instead
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
