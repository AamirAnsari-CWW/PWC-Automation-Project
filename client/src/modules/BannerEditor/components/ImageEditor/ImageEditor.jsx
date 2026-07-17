import { useEffect, useRef, useState } from "react";
import {
  FaCompressArrowsAlt,
  FaRedo,
  FaSearchMinus,
  FaSearchPlus,
  FaSyncAlt,
} from "react-icons/fa";

import Button from "../../../../components/Button/Button";
import {
  MAX_IMAGE_ZOOM,
  MIN_IMAGE_ZOOM,
  clampImageTransform,
  getCenteredImageTransform,
  getFitImageTransform,
  normalizeImageTransform,
  zoomImageTransform,
} from "../../utils/imageTransform";
import "./ImageEditor.css";

function ImageEditor({
  bannerSize,
  currentTransform,
  imageType,
  imageUrl,
  mode = "all",
  isSelected = false,
  onCancel,
  onDone,
  onSelect,
  onTransformChange,
  previewScale,
}) {
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const rotateRef = useRef(null);
  const [imageSize, setImageSize] = useState(null);
  const transform = normalizeImageTransform(currentTransform);
  const isReady = Boolean(imageUrl && imageSize);

  // Load natural dimensions once the preview image changes; transform helpers
  // need the source asset size to calculate fit, zoom, and clamp boundaries.
  useEffect(() => {
    if (!imageUrl) {
      return undefined;
    }

    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!isCancelled) {
        setImageSize({ height: image.naturalHeight, src: imageUrl, width: image.naturalWidth });
      }
    };
    image.src = imageUrl;

    return () => {
      isCancelled = true;
    };
  }, [imageUrl]);

  const commitTransform = (nextTransform) => {
    if (!imageSize) {
      return;
    }

    onTransformChange(
      clampImageTransform({
        bannerHeight: bannerSize.height,
        bannerWidth: bannerSize.width,
        imageHeight: imageSize.height,
        imageWidth: imageSize.width,
        transform: nextTransform,
      }),
    );
  };

  const handlePointerDown = (event) => {
    if (!isReady) {
      return;
    }

    event.preventDefault();
    onSelect?.();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      transform,
    };
  };

  const handlePointerMove = (event) => {
    // The same preview surface owns drag, resize, and rotate gestures. Refs keep
    // the active pointer state outside React render cycles for smoother movement.
    if (resizeRef.current && resizeRef.current.pointerId === event.pointerId) {
      const delta = Math.max(event.clientX - resizeRef.current.startX, event.clientY - resizeRef.current.startY) / previewScale;
      const baseSize = Math.max(imageSize.width, imageSize.height);

      commitTransform({
        ...resizeRef.current.transform,
        scale: resizeRef.current.transform.scale + delta / baseSize,
      });
      return;
    }

    if (rotateRef.current && rotateRef.current.pointerId === event.pointerId) {
      const rect = event.currentTarget.parentElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI) + 90;

      commitTransform({
        ...rotateRef.current.transform,
        rotation: angle,
      });
      return;
    }

    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    commitTransform({
      ...dragRef.current.transform,
      x: dragRef.current.transform.x + (event.clientX - dragRef.current.startX) / previewScale,
      y: dragRef.current.transform.y + (event.clientY - dragRef.current.startY) / previewScale,
    });
  };

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
    if (resizeRef.current?.pointerId === event.pointerId) {
      resizeRef.current = null;
    }
    if (rotateRef.current?.pointerId === event.pointerId) {
      rotateRef.current = null;
    }
  };

  const setZoom = (nextScale) => {
    if (!imageSize) {
      return;
    }

    onTransformChange(
      zoomImageTransform({
        bannerHeight: bannerSize.height,
        bannerWidth: bannerSize.width,
        imageHeight: imageSize.height,
        imageWidth: imageSize.width,
        nextScale,
        transform,
      }),
    );
  };

  const handleWheel = (event) => {
    if (!isReady) {
      return;
    }

    event.preventDefault();
    setZoom(transform.scale * (event.deltaY > 0 ? (event.shiftKey ? 0.98 : 0.92) : (event.shiftKey ? 1.02 : 1.08)));
  };

  const applyFit = () => {
    if (!imageSize) {
      return;
    }

    onTransformChange(
      getFitImageTransform({
        bannerHeight: bannerSize.height,
        bannerWidth: bannerSize.width,
        imageHeight: imageSize.height,
        imageWidth: imageSize.width,
      }),
    );
  };

  const applyCenter = () => {
    if (!imageSize) {
      return;
    }

    onTransformChange(
      getCenteredImageTransform({
        bannerHeight: bannerSize.height,
        bannerWidth: bannerSize.width,
        imageHeight: imageSize.height,
        imageWidth: imageSize.width,
        transform,
      }),
    );
  };

  const startResize = (event) => {
    if (!isReady) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      transform,
    };
  };

  const startRotate = (event) => {
    if (!isReady) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    rotateRef.current = {
      pointerId: event.pointerId,
      transform,
    };
  };

  const toolbar = (
      <div className="image-editor__toolbar" aria-label={`${imageType} image editor`}>
        {/* <span className="image-editor__selected">Selected: {selectedLabel || imageType}</span> */}
        <Button disabled={!isReady} onClick={applyFit} size="sm" title="Fit to canvas" type="button" variant="secondary">
          <FaCompressArrowsAlt aria-hidden="true" />
        </Button>

        <Button disabled={!isReady} onClick={applyCenter} size="sm" title="Center image" type="button" variant="secondary">
          <FaSyncAlt aria-hidden="true" />
        </Button>

        <Button disabled={!isReady} onClick={applyFit} size="sm" title="Reset" type="button" variant="secondary">
          <FaRedo aria-hidden="true" />
        </Button>

        <Button disabled={!isReady} onClick={() => setZoom(transform.scale / 1.12)} size="sm" title="Zoom out" type="button" variant="secondary">
          <FaSearchMinus aria-hidden="true" />
        </Button>

        <label className="image-editor__zoom">
          <span>{transform.scale.toFixed(2)}x</span>
          <input
            disabled={!isReady}
            max={MAX_IMAGE_ZOOM}
            min={MIN_IMAGE_ZOOM}
            onChange={(event) => setZoom(Number(event.target.value))}
            step="0.01"
            type="range"
            value={transform.scale}
          />
        </label>

        <Button disabled={!isReady} onClick={() => setZoom(transform.scale * 1.12)} size="sm" title="Zoom in" type="button" variant="secondary">
          <FaSearchPlus aria-hidden="true" />
        </Button>

        <Button onClick={onCancel} size="sm" type="button" variant="ghost">
          Cancel
        </Button>
        
        <Button onClick={onDone} size="sm" type="button">
          Done
        </Button>
      </div>
  );

  const surfaceStyle = imageSize
    ? {
        height: `${imageSize.height}px`,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
        width: `${imageSize.width}px`,
      }
    : undefined;

  const surface = (
      <div
        aria-label={`Drag ${imageType} image`}
        className={`image-editor__surface ${isSelected ? "is-selected" : ""}`}
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        role="application"
        style={surfaceStyle}
      >
        {isSelected && (
          <>
            <span className="image-editor__handle image-editor__handle--nw" onPointerDown={startResize} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
            <span className="image-editor__handle image-editor__handle--ne" onPointerDown={startResize} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
            <span className="image-editor__handle image-editor__handle--sw" onPointerDown={startResize} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
            <span className="image-editor__handle image-editor__handle--se" onPointerDown={startResize} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
            <span className="image-editor__rotate" onPointerDown={startRotate} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
          </>
        )}
      </div>
  );

  if (mode === "toolbar") {
    return toolbar;
  }

  if (mode === "surface") {
    return surface;
  }

  return (
    <>
      {toolbar}
      {surface}
    </>
  );
}

export default ImageEditor;
