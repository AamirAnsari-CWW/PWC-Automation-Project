import { NavLink } from "react-router-dom";
import {
  FaCog,
  FaFileExport,
  FaFolderOpen,
  FaHome,
  FaImages,
} from "react-icons/fa";

import { ROUTES } from "../../constants/routes";
import "./Sidebar.css";

const navigationItems = [
  { to: ROUTES.dashboard, label: "Dashboard", icon: FaHome, end: true },
  { to: ROUTES.templates, label: "Templates", icon: FaImages },
  { to: ROUTES.projects, label: "Projects", icon: FaFolderOpen },
  { to: ROUTES.exports, label: "Exports", icon: FaFileExport },
  // { to: ROUTES.settings, label: "Settings", icon: FaCog },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span>BA</span>
        <div>
          <h2>BannerOps</h2>
          <p>Creative Automation</p>
        </div>
      </div>

      <nav className="menu">
        {navigationItems.map(({ end, icon: Icon, label, to }) => (
          <NavLink className="menu-item" end={end} key={to} to={to}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* <div className="avatar">A</div> */}
        {/* <div>
          <h4>Aamir</h4>
          <p>Administrator</p>
        </div> */}
      </div>
    </aside>
  );
}

export default Sidebar;
