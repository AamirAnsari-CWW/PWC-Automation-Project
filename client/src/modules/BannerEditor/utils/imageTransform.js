const MIN_ZOOM_STEP = 0.05;

export const getInitialBackgroundTransform = ({ bannerHeight, bannerWidth, imageHeight, imageWidth }) => {
  if (!bannerWidth || !bannerHeight || !imageWidth || !imageHeight) {
    return { x: 0, y: 0, scale: 1 };
  }

  const scale = Math.max(bannerWidth / imageWidth, bannerHeight / imageHeight);

  return {
    x: (bannerWidth - imageWidth * scale) / 2,
    y: (bannerHeight - imageHeight * scale) / 2,
    scale,
  };
};

export const clampBackgroundTransform = ({ bannerHeight, bannerWidth, imageHeight, imageWidth, transform }) => {
  if (!bannerWidth || !bannerHeight || !imageWidth || !imageHeight) {
    return transform;
  }

  const minScale = Math.max(bannerWidth / imageWidth, bannerHeight / imageHeight);
  const scale = Math.max(Number(transform.scale || 1), minScale);
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;
  const minX = bannerWidth - scaledWidth;
  const minY = bannerHeight - scaledHeight;

  return {
    x: scaledWidth <= bannerWidth ? (bannerWidth - scaledWidth) / 2 : Math.min(0, Math.max(minX, Number(transform.x || 0))),
    y: scaledHeight <= bannerHeight ? (bannerHeight - scaledHeight) / 2 : Math.min(0, Math.max(minY, Number(transform.y || 0))),
    scale,
  };
};

export const zoomBackgroundTransform = ({
  bannerHeight,
  bannerWidth,
  imageHeight,
  imageWidth,
  nextScale,
  transform,
}) => {
  const currentScale = Number(transform.scale || 1);
  const scale = Math.max(MIN_ZOOM_STEP, Number(nextScale || currentScale));
  const centerX = bannerWidth / 2;
  const centerY = bannerHeight / 2;
  const ratio = scale / currentScale;

  return clampBackgroundTransform({
    bannerHeight,
    bannerWidth,
    imageHeight,
    imageWidth,
    transform: {
      x: centerX - (centerX - Number(transform.x || 0)) * ratio,
      y: centerY - (centerY - Number(transform.y || 0)) * ratio,
      scale,
    },
  });
};
