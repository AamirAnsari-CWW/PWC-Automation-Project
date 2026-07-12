import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Loader/Loader";
import { useTemplates } from "../../hooks/useTemplates";
import TemplateCard from "./components/TemplateCard/TemplateCard";
import "./TemplateLibrary.css";

function TemplateLibrary() {
  const { error, isLoading, templates } = useTemplates();

  return (
    <Layout>
      <div className="page template-library">
        <header className="page-header">
          <div>
            <h1>Template Library</h1>
            <p>
              Choose an approved template and banner size. Editable fields are controlled by each template.json file.
            </p>
          </div>
        </header>

        {isLoading && <Loader label="Loading templates" />}
        {error && <p className="template-library__error">{error}</p>}

        <section className="template-library__grid">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </section>
      </div>
    </Layout>
  );
}

export default TemplateLibrary;
