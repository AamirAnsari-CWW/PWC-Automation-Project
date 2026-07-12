import { Routes, Route } from "react-router-dom";

import { ROUTES } from "./constants/routes";
import Dashboard from "./modules/Dashboard/Dashboard";
import TemplateLibrary from "./modules/TemplateLibrary/TemplateLibrary";
import BannerEditor from "./modules/BannerEditor/BannerEditor";
import Projects from "./modules/Projects/Projects";
import Settings from "./modules/Settings/Settings";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.exports} element={<Projects />} />
      <Route path={ROUTES.dashboard} element={<Dashboard />} />
      <Route path={ROUTES.templates} element={<TemplateLibrary />} />
      <Route path={ROUTES.editor} element={<BannerEditor />} />
      <Route path={ROUTES.projects} element={<Projects />} />
      <Route path={ROUTES.settings} element={<Settings />} />
    </Routes>
  );
}

export default App;
