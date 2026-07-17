import { useMemo, useState } from "react";
import { FaChevronDown, FaEye, FaEyeSlash, FaImage, FaPen, FaShapes, FaUpload } from "react-icons/fa";

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
  backgroundAdjustmentMode,
  backgroundState,
  frame1BackgroundState,
  imageAdjustments,
  imageValues,
  isImageAdjustmentMode,
  onBackgroundChange,
  onFrame1BackgroundAdjustmentModeStart,
  onFrame1BackgroundChange,
  onImageAdjustmentChange,
  onImageAdjustmentModeStart,
  onImageChange,
  onShapeAdjustmentChange,
  onSiloFineAdjustmentModeStart,
  onTextChange,
  shapeAdjustments,
  template,
  textValues,
}) {
  const [activeSection, setActiveSection] = useState("text");
  const [activeImageName, setActiveImageName] = useState(null);
  const [activeShapeName, setActiveShapeName] = useState(null);

  // The logo is not always listed in template metadata, but keeping it in the
  // editable set lets future controls reuse the same adjustment modal.
  const editableImageNames = useMemo(() => {
    return Array.from(
      new Set([...(template.editableImages || []), LOGO_IMAGE_NAME]),
    );
  }, [template.editableImages]);

  const activeAdjustment =
    activeImageName === MAIN_BACKGROUND_NAME
      ? backgroundAdjustmentMode === "frame1"
        ? frame1BackgroundState
        : backgroundState
      : imageAdjustments[activeImageName] || DEFAULT_ADJUSTMENT;
  const shapeDefinitions = template.shapeDefinitions || {};
  const activeShapeAdjustment = activeShapeName
    ? {
        ...DEFAULT_SHAPE_ADJUSTMENT,
        ...(shapeAdjustments[activeShapeName] || {}),
      }
    : DEFAULT_SHAPE_ADJUSTMENT;
  const canAdjustImages = (template.editableImages || []).every((imageName) => Boolean(imageValues[imageName]));

  // Background controls can target either the final composition or the first
  // animation frame; non-background images are routed to image adjustments.
  const handleAdjustmentChange = (nextAdjustment) => {
    if (!activeImageName) {
      return;
    }

    if (activeImageName === MAIN_BACKGROUND_NAME) {
      if (backgroundAdjustmentMode === "frame1") {
        onFrame1BackgroundChange(nextAdjustment);
        return;
      }

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

  const renderSection = (sectionId, title, icon, children) => {
    const isOpen = activeSection === sectionId;

    return (
      <section className={`property-panel__section ${isOpen ? "is-open" : ""}`}>
        <button
          aria-expanded={isOpen}
          className="property-panel__section-toggle"
          onClick={() => setActiveSection(sectionId)}
          type="button"
        >
          <span className="property-panel__section-title">
            {icon}
            {title}
          </span>
          <FaChevronDown aria-hidden="true" />
        </button>
        {isOpen && <div className="property-panel__section-body">{children}</div>}
      </section>
    );
  };

  return (
    <Card className="property-panel">
      <div className="property-panel__header">
        <div>
          <span>Properties</span>
          <h2>Banner Controls</h2>
        </div>
        <p>Template fields stay editable while animation and timeline behavior remain locked.</p>
      </div>

      <div className="property-panel__sections">
        {renderSection(
          "text",
          "Text",
          <FaPen aria-hidden="true" />,
          <TextEditor fields={template.editableTexts} onChange={onTextChange} values={textValues} />
        )}

        {renderSection(
          "images",
          "Images",
          <FaImage aria-hidden="true" />,
          <div className="property-panel__images">
            {template.editableImages.map((imageName) => (
              <label className="property-panel__image-control" key={imageName}>
                <span>{imageName === MAIN_BACKGROUND_NAME ? "Background" : "Silo"}</span>
                <input
                  accept="image/*"
                  onChange={(event) =>
                    onImageChange(imageName, event.target.files?.[0])
                  }
                  type="file"
                />
                {imageValues[imageName] && <strong>Selected</strong>}
              </label>
            ))}
            <Button
              disabled={!canAdjustImages || isImageAdjustmentMode}
              onClick={onImageAdjustmentModeStart}
              type="button"
              variant="secondary"
            >
              <FaUpload aria-hidden="true" />
              Final Background
            </Button>
            <Button
              disabled={!canAdjustImages || isImageAdjustmentMode}
              onClick={onFrame1BackgroundAdjustmentModeStart}
              type="button"
              variant="secondary"
            >
              <FaUpload aria-hidden="true" />
              Frame 1 Background
            </Button>
            <article className="property-panel__image-control">
              <span>Silo Fine Adjustment</span>
              <small>Adjust silo position after the grouped background and silo adjustment.</small>
              <Button
                disabled={!canAdjustImages}
                onClick={onSiloFineAdjustmentModeStart}
                type="button"
                variant="secondary"
              >
                Adjust Silo
              </Button>
            </article>
            {/* <article className="property-panel__image-control">
              <span>Logo</span>
              <small>Adjust logo position over the banner frame.</small>
              <Button
                onClick={() => setActiveImageName(LOGO_IMAGE_NAME)}
                size="sm"
                type="button"
                variant="secondary"
              >
                <FaUpload aria-hidden="true" />
                Edit Logo
              </Button>
            </article> */}
          </div>
        )}

        {Object.keys(shapeDefinitions).length > 0 &&
          renderSection(
            "shapes",
            "Shapes",
            <FaShapes aria-hidden="true" />,
            <div className="property-panel__images">
            {Object.entries(shapeDefinitions).map(([shapeName, selector]) => (
              <label className="property-panel__image-control" key={shapeName}>
                <span>Orange Strip</span>
                <small>{selector} X, Y, scale, rotation, and visibility</small>
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
                    <FaShapes aria-hidden="true" />
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
                    {shapeAdjustments[shapeName]?.visible === false ? (
                      <FaEye aria-hidden="true" />
                    ) : (
                      <FaEyeSlash aria-hidden="true" />
                    )}
                    {shapeAdjustments[shapeName]?.visible === false
                      ? "Show"
                      : "Hide"}
                  </Button>
                </div>
              </label>
            ))}
            </div>
          )}

      </div>

      {activeImageName && editableImageNames.includes(activeImageName) && (
        <BackgroundEditor
          imageName={activeImageName}
          onChange={handleAdjustmentChange}
          onClose={() => setActiveImageName(null)}
          title={
            activeImageName === MAIN_BACKGROUND_NAME
              ? backgroundAdjustmentMode === "frame1"
                ? "Edit Frame 1 Background"
                : "Edit Final Background"
              : `Edit ${activeImageName}`
          }
          value={activeAdjustment}
        />
      )}

      {activeShapeName && shapeDefinitions[activeShapeName] && (
        <BackgroundEditor
          description={`${shapeDefinitions[activeShapeName]} position, scale, rotation, and visibility`}
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
