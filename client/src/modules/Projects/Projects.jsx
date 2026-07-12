import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Layout from "../../components/Layout/Layout";
import { routeToEditor } from "../../constants/routes";
import { deleteProject, duplicateProject, getProjects } from "../../services/projectService";

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const refreshProjects = async () => {
    const projectList = await getProjects();
    setProjects(projectList);
  };

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      const projectList = await getProjects();

      if (isMounted) {
        setProjects(projectList);
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDuplicate = async (projectId) => {
    await duplicateProject(projectId);
    await refreshProjects();
  };

  const handleDelete = async (projectId) => {
    await deleteProject(projectId);
    await refreshProjects();
  };

  return (
    <Layout>
      <div className="page">
        <header className="page-header">
          <div>
            <h1>Projects</h1>
            <p>Saved banner variants and export-ready packages will be managed here.</p>
          </div>
        </header>
        <Card className="projects-table">
          {projects.map((project) => (
            <article key={project.id}>
              <div>
                <h2>{project.name}</h2>
                <p>{project.templateName} - {project.size}</p>
              </div>
              <div className="projects-table__actions">
                <Button
                  onClick={() => navigate(`${routeToEditor(project.templateId, project.size)}?project=${project.id}`)}
                  size="sm"
                  variant="secondary"
                >
                  Open
                </Button>
                <Button onClick={() => handleDuplicate(project.id)} size="sm" variant="secondary">
                  Duplicate
                </Button>
                <Button onClick={() => handleDelete(project.id)} size="sm" variant="ghost">
                  Delete
                </Button>
              </div>
            </article>
          ))}
          {!projects.length && <p>No saved projects yet.</p>}
        </Card>
      </div>
    </Layout>
  );
}

export default Projects;
