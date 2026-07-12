import { useMemo, useState } from "react";

import Button from "../../../../components/Button/Button";
import Card from "../../../../components/Card/Card";
import BackgroundEditor from "../BackgroundEditor/BackgroundEditor";
import TextEditor from "../TextEditor/TextEditor";
import "./PropertyPanel.css";

const LOGO_IMAGE_NAME = "logo_white.svg";
const MAIN_BACKGROUND_NAME = "mainbg.jpg";
const DEFAULT_ADJUSTMENT = { x: 0, y: 0, scale: 1 };
const DEFAULT_SHAPE_ADJUSTMENT = { x: 0, y: 0, scale: 1, visible: true };

function PropertyPanel({
  backgroundState,
  hiddenImages,
  imageAdjustments,
  imageValues,
  onBackgroundChange,
  onImageAdjustmentChange,
  onImageChange,
  onImageVisibilityChange,
  onShapeAdjustmentChange,
  onTextChange,
  shapeAdjustments,
  template,
  textValues,
}) {
  const [activeImageName, setActiveImageName] = useState(null);
  const [activeShapeName, setActiveShapeName] = useState(null);

  const editableImageNames = useMemo(() => {
    return Array.from(
      new Set([...(template.editableImages || []), LOGO_IMAGE_NAME]),
    );
  }, [template.editableImages]);

  const activeAdjustment =
    activeImageName === MAIN_BACKGROUND_NAME
      ? backgroundState
      : imageAdjustments[activeImageName] || DEFAULT_ADJUSTMENT;
  const shapeDefinitions = template.shapeDefinitions || {};
  const activeShapeAdjustment = activeShapeName
    ? {
        ...DEFAULT_SHAPE_ADJUSTMENT,
        ...(shapeAdjustments[activeShapeName] || {}),
      }
    : DEFAULT_SHAPE_ADJUSTMENT;

  const handleAdjustmentChange = (nextAdjustment) => {
    if (!activeImageName) {
      return;
    }

    if (activeImageName === MAIN_BACKGROUND_NAME) {
      onBackgroundChange(nextAdjustment);
      return;
    }

    onImageAdjustmentChange(activeImageName, nextAdjustment);
  };

  const handleShapeAdjustmentChange = (nextAdjustment) => {
    if (!activeShapeName) {
      return;
    }

    onShapeAdjustmentChange(activeShapeName, nextAdjustment);
  };

  return (
    <Card className="property-panel">
      <section className="property-panel__section">
        <h2>Template Rules</h2>
        <p>
          Only fields listed in template.json are editable. Animation and GSAP
          timelines stay locked.
        </p>
      </section>

      <div className="property-panel__editable-row">
        <TextEditor
          fields={template.editableTexts}
          onChange={onTextChange}
          values={textValues}
        />

        <section className="property-panel__section">
          <h2>Editable Images</h2>
          <div className="property-panel__images">
            {template.editableImages.map((imageName) => (
              <label className="property-panel__image-control" key={imageName}>
                <span>{imageName}</span>
                <input
                  accept="image/*"
                  onChange={(event) =>
                    onImageChange(imageName, event.target.files?.[0])
                  }
                  type="file"
                />
                {imageValues[imageName] && <strong>Selected</strong>}
                <div className="property-panel__image-actions">
                  <Button
                    disabled={!imageValues[imageName]}
                    onClick={(event) => {
                      event.preventDefault();
                      setActiveImageName(imageName);
                    }}
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    {imageName === MAIN_BACKGROUND_NAME
                      ? "Edit Background"
                      : "Edit Image"}
                  </Button>
                  {imageName !== MAIN_BACKGROUND_NAME && (
                    <Button
                      onClick={(event) => {
                        event.preventDefault();
                        onImageVisibilityChange(
                          imageName,
                          Boolean(hiddenImages[imageName]),
                        );
                      }}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {hiddenImages[imageName] ? "Show" : "Hide"}
                    </Button>
                  )}
                </div>
              </label>
            ))}
          </div>
          <section className="property-panel__section">
            <div className="property-panel__images">
              <label>
              <div>
                <h2> Logo</h2>
                <p>Adjust logo position over the banner frame.</p>
              </div>
              <Button
                onClick={() => setActiveImageName(LOGO_IMAGE_NAME)}
                size="sm"
                type="button"
                variant="secondary"
              >
                Edit Logo
              </Button>
              </label>
            </div>
          </section>
          {Object.keys(shapeDefinitions).length > 0 && (
        <section className="property-panel__section">
          <h2>Orange Strip</h2>
          <div className="property-panel__images">
            {Object.entries(shapeDefinitions).map(([shapeName, selector]) => (
              <label className="property-panel__image-control" key={shapeName}>
                {/* <span>{shapeName}</span> */}
                <small>Adjust Orange Strip From Here</small>
                <div className="property-panel__image-actions">
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      setActiveImageName(null);
                      setActiveShapeName(shapeName);
                    }}
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    Edit Strip
                  </Button>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      const current = {
                        ...DEFAULT_SHAPE_ADJUSTMENT,
                        ...(shapeAdjustments[shapeName] || {}),
                      };
                      onShapeAdjustmentChange(shapeName, {
                        ...current,
                        visible: current.visible === false,
                      });
                    }}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {shapeAdjustments[shapeName]?.visible === false
                      ? "Show"
                      : "Hide"}
                  </Button>
                </div>
              </label>
            ))}
          </div>
        </section>
      )}
        </section>
      </div>

      {activeImageName && editableImageNames.includes(activeImageName) && (
        <BackgroundEditor
          imageName={activeImageName}
          onChange={handleAdjustmentChange}
          onClose={() => setActiveImageName(null)}
          title={
            activeImageName === MAIN_BACKGROUND_NAME
              ? "Edit Background"
              : `Edit ${activeImageName}`
          }
          value={activeAdjustment}
        />
      )}

      {activeShapeName && shapeDefinitions[activeShapeName] && (
        <BackgroundEditor
          description={`${shapeDefinitions[activeShapeName]} position, scale, and visibility`}
          imageName={activeShapeName}
          onChange={handleShapeAdjustmentChange}
          onClose={() => setActiveShapeName(null)}
          showRotation
          showVisibility
          title={`Edit ${activeShapeName}`}
          value={activeShapeAdjustment}
        />
      )}
    </Card>
  );
}

export default PropertyPanel;
