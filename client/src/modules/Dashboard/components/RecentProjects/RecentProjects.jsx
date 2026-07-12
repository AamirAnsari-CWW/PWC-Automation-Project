import Card from "../../../../components/Card/Card";
import "./RecentProjects.css";

const formatUpdatedAt = (value) => {
  if (!value) {
    return "Not saved";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
};

function RecentProjects({ projects }) {
  return (
    <Card className="recent-projects">
      <div className="section-title">
        <h2>Recent Projects</h2>
      </div>
      <div className="recent-projects__rows">
        {projects.length ? (
          projects.map((project) => (
            <article className="recent-projects__row" key={project.id}>
              <div>
                <h3>{project.name}</h3>
                <p>{project.templateName || project.templateId}</p>
              </div>
              <span>{formatUpdatedAt(project.updatedAt)}</span>
            </article>
          ))
        ) : (
          <p className="recent-projects__empty">No projects yet.</p>
        )}
      </div>
    </Card>
  );
}

export default RecentProjects;
