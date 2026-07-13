import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Button from "../../../../components/Button/Button";
import Card from "../../../../components/Card/Card";
import { createBannerBridge } from "../../services/bannerBridge";
import { buildPreviewUrl } from "../../services/previewService";
import {
  clampBackgroundTransform,
  getInitialBackgroundTransform,
  zoomBackgroundTransform,
} from "../../utils/imageTransform";
import "./BannerPreview.css";

const MAIN_BACKGROUND_NAME = "mainbg.jpg";

function BannerPreview({
  backgroundState,
  hiddenImages,
  imageAdjustments,
  imageValues,
  onBackgroundChange,
  shapeAdjustments,
  shapeDefinitions,
  size,
  template,
  textValues,
}) {
  const iframeRef = useRef(null);
  const dragRef = useRef(null);
  const stageRef = useRef(null);
  const previewUrl = buildPreviewUrl(size);
  const backgroundImageUrl = imageValues[MAIN_BACKGROUND_NAME];
  const [loadedBackgroundImage, setLoadedBackgroundImage] = useState(null);
  const backgroundImageSize =
    loadedBackgroundImage?.src === backgroundImageUrl
      ? loadedBackgroundImage
      : null;
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
  const minBackgroundScale = backgroundImageSize
    ? getInitialBackgroundTransform({
        bannerHeight: size.height,
        bannerWidth: size.width,
        imageHeight: backgroundImageSize.height,
        imageWidth: backgroundImageSize.width,
      }).scale
    : 1;
  const maxBackgroundScale = Math.max(minBackgroundScale * 4, Number(backgroundState.scale || 1));
  const hasEditableBackground = Boolean(backgroundImageUrl && backgroundImageSize && onBackgroundChange);

  useEffect(() => {
    if (!backgroundImageUrl) {
      return undefined;
    }

    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!isCancelled) {
        setLoadedBackgroundImage({ height: image.naturalHeight, src: backgroundImageUrl, width: image.naturalWidth });
      }
    };
    image.src = backgroundImageUrl;

    return () => {
      isCancelled = true;
    };
  }, [backgroundImageUrl]);

  useEffect(() => {
    if (!backgroundImageSize || !onBackgroundChange) {
      return;
    }

    const nextBackground = clampBackgroundTransform({
      bannerHeight: size.height,
      bannerWidth: size.width,
      imageHeight: backgroundImageSize.height,
      imageWidth: backgroundImageSize.width,
      transform: backgroundState,
    });

    if (
      Math.abs(nextBackground.x - Number(backgroundState.x || 0)) > 0.01 ||
      Math.abs(nextBackground.y - Number(backgroundState.y || 0)) > 0.01 ||
      Math.abs(nextBackground.scale - Number(backgroundState.scale || 1)) > 0.0001
    ) {
      onBackgroundChange(nextBackground);
    }
  }, [backgroundImageSize, backgroundState, onBackgroundChange, size.height, size.width]);

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

  const updateBackground = (nextTransform) => {
    if (!backgroundImageSize || !onBackgroundChange) {
      return;
    }

    onBackgroundChange(
      clampBackgroundTransform({
        bannerHeight: size.height,
        bannerWidth: size.width,
        imageHeight: backgroundImageSize.height,
        imageWidth: backgroundImageSize.width,
        transform: nextTransform,
      }),
    );
  };

  const handlePointerDown = (event) => {
    if (!hasEditableBackground) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      transform: backgroundState,
    };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    updateBackground({
      ...dragRef.current.transform,
      x: Number(dragRef.current.transform.x || 0) + (event.clientX - dragRef.current.startX) / previewScale,
      y: Number(dragRef.current.transform.y || 0) + (event.clientY - dragRef.current.startY) / previewScale,
    });
  };

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  const handleWheel = (event) => {
    if (!hasEditableBackground) {
      return;
    }

    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.94 : 1.06;

    updateBackground(
      zoomBackgroundTransform({
        bannerHeight: size.height,
        bannerWidth: size.width,
        imageHeight: backgroundImageSize.height,
        imageWidth: backgroundImageSize.width,
        nextScale: Number(backgroundState.scale || minBackgroundScale) * zoomFactor,
        transform: backgroundState,
      }),
    );
  };

  const handleZoomSliderChange = (event) => {
    if (!backgroundImageSize) {
      return;
    }

    updateBackground(
      zoomBackgroundTransform({
        bannerHeight: size.height,
        bannerWidth: size.width,
        imageHeight: backgroundImageSize.height,
        imageWidth: backgroundImageSize.width,
        nextScale: Number(event.target.value),
        transform: backgroundState,
      }),
    );
  };

  const handleResetBackground = () => {
    if (!backgroundImageSize || !onBackgroundChange) {
      return;
    }

    onBackgroundChange(
      getInitialBackgroundTransform({
        bannerHeight: size.height,
        bannerWidth: size.width,
        imageHeight: backgroundImageSize.height,
        imageWidth: backgroundImageSize.width,
      }),
    );
  };

  return (
    <Card className="banner-preview">
      <div className="section-title">
        <div>
          <h2>Preview</h2>
          <p>{size.width} x {size.height}px HTML5 banner</p>
        </div>
        <div className="banner-preview__tools">
          {backgroundImageUrl && (
            <>
              <label className="banner-preview__zoom">
                <span>Zoom</span>
                <input
                  disabled={!hasEditableBackground}
                  max={maxBackgroundScale}
                  min={minBackgroundScale}
                  onChange={handleZoomSliderChange}
                  step="0.01"
                  type="range"
                  value={Number(backgroundState.scale || minBackgroundScale)}
                />
              </label>
              <Button disabled={!hasEditableBackground} onClick={handleResetBackground} size="sm" type="button" variant="secondary">
                Reset
              </Button>
            </>
          )}
          <span className="status-pill">Live</span>
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
            {backgroundImageUrl && (
              <div
                aria-label="Drag background image"
                className="banner-preview__background-controller"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                role="application"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BannerPreview;
