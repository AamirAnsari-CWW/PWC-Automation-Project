import { useLocation } from "react-router-dom";
import { FaBell, FaSearch } from "react-icons/fa";

import "./Navbar.css";

const pageCopy = {
  "/": {
    title: "Dashboard",
    subtitle: "Monitor templates, exports, and campaign readiness.",
  },
  "/templates": {
    title: "Template Library",
    subtitle: "Select an approved HTML5 banner template and size.",
  },
  "/editor": {
    title: "Banner Editor",
    subtitle: "Edit approved content while preserving animation files.",
  },
  "/projects": {
    title: "Projects",
    subtitle: "Track saved banner packages and export status.",
  },
  "/exports": {
    title: "Exports",
    subtitle: "Review generated HTML5 banner ZIP packages.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage platform defaults and team preferences.",
  },
};

function Navbar() {
  const { pathname } = useLocation();
  const basePath = `/${pathname.split("/")[1]}`;
  const activePage = pageCopy[pathname] || pageCopy[basePath] || pageCopy["/"];

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>{activePage.title}</h2>
        <p>{activePage.subtitle}</p>
      </div>

      {/* <div className="navbar-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search templates..." />
        </div>

        <button className="notification-btn" aria-label="Notifications">
          <FaBell />
          <span className="notification-dot" />
        </button>
      </div> */}
    </header>
  );
}

export default Navbar;
