export const MIN_IMAGE_ZOOM = 0.1;
export const MAX_IMAGE_ZOOM = 8;

export const normalizeImageTransform = (transform = {}) => ({
  x: Number(transform.x || 0),
  y: Number(transform.y || 0),
  scale: Number(transform.scale || 1),
  rotation: Number(transform.rotation || 0),
  visible: transform.visible !== false,
});

export const getFitImageTransform = ({ bannerHeight, bannerWidth, imageHeight, imageWidth }) => {
  if (!bannerWidth || !bannerHeight || !imageWidth || !imageHeight) {
    return normalizeImageTransform();
  }

  const scale = Math.max(bannerWidth / imageWidth, bannerHeight / imageHeight);

  return normalizeImageTransform({
    x: (bannerWidth - imageWidth * scale) / 2,
    y: (bannerHeight - imageHeight * scale) / 2,
    scale,
  });
};

export const getCenteredImageTransform = ({ bannerHeight, bannerWidth, imageHeight, imageWidth, transform }) => {
  const nextTransform = normalizeImageTransform(transform);

  return {
    ...nextTransform,
    x: (bannerWidth - imageWidth * nextTransform.scale) / 2,
    y: (bannerHeight - imageHeight * nextTransform.scale) / 2,
  };
};

export const getActualSizeImageTransform = ({ bannerHeight, bannerWidth, imageHeight, imageWidth, transform }) => {
  return getCenteredImageTransform({
    bannerHeight,
    bannerWidth,
    imageHeight,
    imageWidth,
    transform: {
      ...normalizeImageTransform(transform),
      scale: 1,
    },
  });
};

export const clampImageTransform = ({ transform }) => {
  const nextTransform = normalizeImageTransform(transform);

  return {
    ...nextTransform,
    scale: Math.min(MAX_IMAGE_ZOOM, Math.max(MIN_IMAGE_ZOOM, nextTransform.scale)),
    x: Number(nextTransform.x || 0),
    y: Number(nextTransform.y || 0),
  };
};

export const zoomImageTransform = ({
  bannerHeight,
  bannerWidth,
  imageHeight,
  imageWidth,
  nextScale,
  transform,
}) => {
  const currentTransform = normalizeImageTransform(transform);
  const scale = Math.min(MAX_IMAGE_ZOOM, Math.max(MIN_IMAGE_ZOOM, Number(nextScale || currentTransform.scale)));
  const centerX = bannerWidth / 2;
  const centerY = bannerHeight / 2;
  const ratio = scale / currentTransform.scale;

  return clampImageTransform({
    bannerHeight,
    bannerWidth,
    imageHeight,
    imageWidth,
    transform: {
      ...currentTransform,
      x: centerX - (centerX - currentTransform.x) * ratio,
      y: centerY - (centerY - currentTransform.y) * ratio,
      scale,
    },
  });
};
