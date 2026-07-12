import { useNavigate } from "react-router-dom";
import { FaFileExport, FaImages, FaLayerGroup } from "react-icons/fa";

import Button from "../../components/Button/Button";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Loader/Loader";
import { ROUTES } from "../../constants/routes";
import { useProjects } from "../../hooks/useProjects";
import { useTemplates } from "../../hooks/useTemplates";
import RecentProjects from "./components/RecentProjects/RecentProjects";
import RecentTemplates from "./components/RecentTemplates/RecentTemplates";
import StatsCard from "./components/StatsCard/StatsCard";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { error, isLoading, templates } = useTemplates();
  const projectsState = useProjects();
  const hasError = error || projectsState.error;
  const isDashboardLoading = isLoading || projectsState.isLoading;

  return (
    <Layout>
      <div className="page dashboard">
        <header className="page-header">
          <div>
            <h1>Banner Automation Workspace</h1>
            <p>
              Manage approved templates, create banner variants, and prepare HTML5 packages for export.
            </p>
          </div>
          <Button onClick={() => navigate(ROUTES.templates)}>Start from Template</Button>
        </header>

        {isDashboardLoading && <Loader label="Loading template engine" />}
        {hasError && <p className="template-library__error">{hasError}</p>}

        {!isDashboardLoading && !hasError && (
          <>
            <section className="dashboard__stats">
              <StatsCard icon={FaImages} label="Approved Templates" value={templates.length} />
              <StatsCard icon={FaLayerGroup} label="Active Projects" value={projectsState.projects.length} tone="green" />
              <StatsCard icon={FaFileExport} label="Exports This Week" value="0" tone="orange" />
            </section>

            <section className="dashboard__grid">
              <RecentTemplates templates={templates.slice(0, 3)} />
              <RecentProjects projects={projectsState.projects.slice(0, 3)} />
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
