import { FaDownload, FaEye, FaSave } from "react-icons/fa";

import Button from "../../../../components/Button/Button";
import "./Toolbar.css";

function Toolbar({ onExport, onSave, saveStatus, templateName, sizeLabel }) {
  const statusLabel = {
    failed: "Save Failed",
    idle: "",
    saved: "Saved",
    saving: "Saving...",
  }[saveStatus];

  return (
    <div className="editor-toolbar">
      <div>
        <h1>{templateName}</h1>
        <p>{sizeLabel} HTML5 banner package {statusLabel && `- ${statusLabel}`}</p>
      </div>
      <div className="editor-toolbar__actions">
        <Button onClick={onSave} size="sm" variant="secondary">
          <FaSave /> Save
        </Button>
        <Button onClick={onExport} size="sm">
          <FaDownload /> Export ZIP
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
