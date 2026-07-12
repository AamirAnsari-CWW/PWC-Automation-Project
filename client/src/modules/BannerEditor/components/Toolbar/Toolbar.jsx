import { FaDownload, FaSave } from "react-icons/fa";

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
        <p>
          <span>{sizeLabel}</span>
          <span>HTML5 banner package</span>
          {statusLabel && <span>{statusLabel}</span>}
        </p>
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
