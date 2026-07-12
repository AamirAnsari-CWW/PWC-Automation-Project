import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../../components/Button/Button";
import Card from "../../../../components/Card/Card";
import { routeToEditor } from "../../../../constants/routes";
import { getTemplateDefaultSize } from "../../../../utils/templateUtils";
import SizeSelector from "../SizeSelector/SizeSelector";
import "./TemplateCard.css";

function TemplateCard({ template }) {
  const navigate = useNavigate();
  const defaultSize = getTemplateDefaultSize(template);
  const [selectedSize, setSelectedSize] = useState(defaultSize?.id || template.supportedSizes[0]);

  const openEditor = () => {
    navigate(routeToEditor(template.id, selectedSize));
  };

  return (
    <Card className="template-card">
      <div className="template-card__preview">
        <span>{template.name}</span>
      </div>
      <div className="template-card__body">
        <div className="template-card__header">
          <div>
            <h2>{template.name}</h2>
            <p>{template.description}</p>
          </div>
          <span className="status-pill">{template.status}</span>
        </div>
        <dl className="template-card__meta">
          <div>
            <dt>Texts</dt>
            <dd>{template.editableTexts.length}</dd>
          </div>
          <div>
            <dt>Images</dt>
            <dd>{template.editableImages.length}</dd>
          </div>
          <div>
            <dt>Animation</dt>
            <dd>Locked</dd>
          </div>
        </dl>
        <SizeSelector
          availableSizes={template.supportedSizes}
          onChange={setSelectedSize}
          selectedSize={selectedSize}
        />
        <Button onClick={openEditor}>Open Editor</Button>
      </div>
    </Card>
  );
}

export default TemplateCard;
