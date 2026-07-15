import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Card from "../../../../components/Card/Card";
import { createBannerBridge } from "../../services/bannerBridge";
import { buildPreviewUrl } from "../../services/previewService";
import ImageEditor from "../ImageEditor/ImageEditor";
import SiloFineAdjustment from "../SiloFineAdjustment/SiloFineAdjustment";
import "./BannerPreview.css";

const MAIN_BACKGROUND_NAME = "mainbg.jpg";
const SILO_IMAGE_NAME = "silo.png";

function BannerPreview({
  backgroundState,
  hiddenImages,
  imageAdjustments,
  imageValues,
  isImageAdjustmentMode,
  isSiloFineAdjustmentMode,
  onBackgroundChange,
  onImageAdjustmentCancel,
  onImageAdjustmentDone,
  onSelectedImageChange,
  onSiloFineAdjustmentDone,
  onSiloOffsetChange,
  selectedImageName,
  shapeAdjustments,
  shapeDefinitions,
  size,
  siloOffset,
  template,
  textValues,
}) {
  const iframeRef = useRef(null);
  const stageRef = useRef(null);
  const previewUrl = buildPreviewUrl(size);
  const [previewScale, setPreviewScale] = useState(1);

  useLayoutEffect(() => {
    const stageElement = stageRef.current;

    if (!stageElement || !size?.width || !size?.height) {
      return undefined;
    }

    const updateScale = () => {
      const stageRect = stageElement.getBoundingClientRect();
      const availableWidth = Math.max(stageRect.width - 48, 1);
      const availableHeight = Math.max(stageRect.height - 48, 1);
      const nextScale = Math.min(1, availableWidth / size.width, availableHeight / size.height);

      setPreviewScale(Number(nextScale.toFixed(4)));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(stageElement);

    return () => resizeObserver.disconnect();
  }, [size.height, size.width]);

  const aspectRatio = `${size.width} / ${size.height}`;
  const previewFrameStyle = {
    aspectRatio,
    height: `${size.height * previewScale}px`,
    width: `${size.width * previewScale}px`,
  };
  const previewContentStyle = {
    height: `${size.height}px`,
    transform: `scale(${previewScale})`,
    width: `${size.width}px`,
  };
  const hasCompositionImages = Boolean(imageValues[MAIN_BACKGROUND_NAME] && imageValues[SILO_IMAGE_NAME]);
  const activeImageUrl = hasCompositionImages ? imageValues[MAIN_BACKGROUND_NAME] : null;
  const activeTransform = backgroundState || { x: 0, y: 0, scale: 1, rotation: 0, visible: true };
  const normalizedSiloOffset = {
    x: Number(siloOffset?.x || 0),
    y: Number(siloOffset?.y || 0),
  };

  useEffect(() => {
    if (!isSiloFineAdjustmentMode) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      const directions = {
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
      };
      const direction = directions[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;

      onSiloOffsetChange({
        x: Math.min(50, Math.max(-50, normalizedSiloOffset.x + direction[0] * step)),
        y: Math.min(50, Math.max(-50, normalizedSiloOffset.y + direction[1] * step)),
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSiloFineAdjustmentMode, normalizedSiloOffset.x, normalizedSiloOffset.y, onSiloOffsetChange]);

  useEffect(() => {
    const bridge = createBannerBridge(iframeRef.current);

    bridge.updateText(textValues);
    bridge.updateImages(imageValues);
    bridge.updateImageAdjustments(imageAdjustments);
    bridge.updateImageVisibility(hiddenImages);
    bridge.updateShapeAdjustments({ adjustments: shapeAdjustments, definitions: shapeDefinitions });
    bridge.updateSiloOffset(siloOffset);
    bridge.updateBackground(backgroundState);
  }, [
    backgroundState,
    hiddenImages,
    imageAdjustments,
    imageValues,
    shapeAdjustments,
    shapeDefinitions,
    siloOffset,
    textValues,
    previewUrl,
  ]);

  const handlePreviewLoad = () => {
    const bridge = createBannerBridge(iframeRef.current);

    bridge.updateText(textValues);
    bridge.updateImages(imageValues);
    bridge.updateImageAdjustments(imageAdjustments);
    bridge.updateImageVisibility(hiddenImages);
    bridge.updateShapeAdjustments({ adjustments: shapeAdjustments, definitions: shapeDefinitions });
    bridge.updateSiloOffset(siloOffset);
    bridge.updateBackground(backgroundState);
  };

  const handleActiveTransformChange = (nextTransform) => {
    onBackgroundChange(nextTransform);
  };

  return (
    <Card className="banner-preview">
      <div className="section-title">
        <div>
          <h2>Preview</h2>
          <p>{size.width} x {size.height}px HTML5 banner</p>
        </div>
        <div className="banner-preview__tools">
          {isImageAdjustmentMode && hasCompositionImages && activeImageUrl && (
            <ImageEditor
              bannerSize={size}
              currentTransform={activeTransform}
              imageType="composition"
              imageUrl={activeImageUrl}
              mode="toolbar"
              onCancel={onImageAdjustmentCancel}
              onDone={onImageAdjustmentDone}
              onTransformChange={handleActiveTransformChange}
              previewScale={previewScale}
              selectedLabel="Composition"
            />
          )}
          <span className="status-pill">{isImageAdjustmentMode || isSiloFineAdjustmentMode ? "Adjusting" : "Live"}</span>
        </div>
      </div>
      <div className="banner-preview__stage" ref={stageRef}>
        <div className="banner-preview__frame" style={previewFrameStyle}>
          <div className="banner-preview__content" style={previewContentStyle}>
            {previewUrl ? (
              <iframe
                className="banner-preview__iframe"
                key={`${template.id}-${size.id}`}
                onLoad={handlePreviewLoad}
                ref={iframeRef}
                src={previewUrl}
                title={`${template.name} ${size.id} preview`}
              />
            ) : (
              <div className="banner-preview__empty">Preview unavailable</div>
            )}
            {isImageAdjustmentMode && hasCompositionImages && (
              <ImageEditor
                bannerSize={size}
                currentTransform={activeTransform}
                imageType="composition"
                imageUrl={activeImageUrl}
                isSelected={selectedImageName === MAIN_BACKGROUND_NAME}
                mode="surface"
                onSelect={() => onSelectedImageChange(MAIN_BACKGROUND_NAME)}
                onTransformChange={handleActiveTransformChange}
                previewScale={previewScale}
              />
            )}
          </div>
        </div>
        {isSiloFineAdjustmentMode && hasCompositionImages && (
          <div className="banner-preview__silo-controls">
            <SiloFineAdjustment
              onChange={onSiloOffsetChange}
              onClose={onSiloFineAdjustmentDone}
              value={normalizedSiloOffset}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

export default BannerPreview;
