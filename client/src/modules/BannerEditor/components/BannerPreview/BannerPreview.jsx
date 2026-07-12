import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Card from "../../../../components/Card/Card";
import { createBannerBridge } from "../../services/bannerBridge";
import { buildPreviewUrl } from "../../services/previewService";
import "./BannerPreview.css";

function BannerPreview({
  backgroundState,
  hiddenImages,
  imageAdjustments,
  imageValues,
  shapeAdjustments,
  shapeDefinitions,
  size,
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

  const previewFrameStyle = {
    height: `${size.height * previewScale}px`,
    width: `${size.width * previewScale}px`,
  };
  const previewContentStyle = {
    height: `${size.height}px`,
    transform: `scale(${previewScale})`,
    width: `${size.width}px`,
  };

  useEffect(() => {
    const bridge = createBannerBridge(iframeRef.current);

    bridge.updateText(textValues);
    bridge.updateImages(imageValues);
    bridge.updateImageAdjustments(imageAdjustments);
    bridge.updateImageVisibility(hiddenImages);
    bridge.updateShapeAdjustments({ adjustments: shapeAdjustments, definitions: shapeDefinitions });
    bridge.updateBackground(backgroundState);
  }, [backgroundState, hiddenImages, imageAdjustments, imageValues, shapeAdjustments, shapeDefinitions, textValues, previewUrl]);

  const handlePreviewLoad = () => {
    const bridge = createBannerBridge(iframeRef.current);

    bridge.updateText(textValues);
    bridge.updateImages(imageValues);
    bridge.updateImageAdjustments(imageAdjustments);
    bridge.updateImageVisibility(hiddenImages);
    bridge.updateShapeAdjustments({ adjustments: shapeAdjustments, definitions: shapeDefinitions });
    bridge.updateBackground(backgroundState);
  };

  return (
    <Card className="banner-preview">
      <div className="section-title">
        <h2>Real HTML5 Preview</h2>
        <span className="status-pill">Live Iframe</span>
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
          </div>
        </div>
      </div>
      <p>
        This iframe loads the approved HTML5 banner package from the backend and preserves its CSS, fonts, images,
        clickTags, JavaScript, and GSAP timeline.
      </p>
    </Card>
  );
}

export default BannerPreview;
