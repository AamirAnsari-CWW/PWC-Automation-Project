import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import Layout from "../../components/Layout/Layout";

function Settings() {
  return (
    <Layout>
      <div className="page">
        <header className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Configure workspace defaults for template storage, exports, and approvals.</p>
          </div>
        </header>
        <Card className="settings-panel">
          <Input id="workspace-name" label="Workspace Name" defaultValue="BannerOps Studio" />
          <Input id="export-folder" label="Default Export Folder" defaultValue="/exports" />
          <Input id="template-root" label="Template Root" defaultValue="/templates" />
        </Card>
      </div>
    </Layout>
  );
}

export default Settings;
