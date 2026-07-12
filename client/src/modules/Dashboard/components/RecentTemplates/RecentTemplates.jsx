import { Link } from "react-router-dom";

import Card from "../../../../components/Card/Card";
import { ROUTES } from "../../../../constants/routes";
import "./RecentTemplates.css";

function RecentTemplates({ templates }) {
  return (
    <Card className="recent-templates">
      <div className="section-title">
        <h2>Recent Templates</h2>
        <Link to={ROUTES.templates}>View all</Link>
      </div>
      <div className="recent-templates__list">
        {templates.map((template) => (
          <article className="recent-templates__item" key={template.id}>
            <div>
              <h3>{template.name}</h3>
              <p>{template.category}</p>
            </div>
            <span className="status-pill">{template.status}</span>
          </article>
        ))}
      </div>
    </Card>
  );
}

export default RecentTemplates;
