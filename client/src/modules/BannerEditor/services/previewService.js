const MESSAGE_TYPES = Object.freeze({
  updateBackground: "UPDATE_BACKGROUND",
  updateImageAdjustments: "UPDATE_IMAGE_ADJUSTMENTS",
  updateImageVisibility: "UPDATE_IMAGE_VISIBILITY",
  updateImage: "UPDATE_IMAGE",
  updateShapeAdjustments: "UPDATE_SHAPE_ADJUSTMENTS",
  updateText: "UPDATE_TEXT",
});

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:5001";

export const buildBackendUrl = (path) => {
  if (!path) {
    return "";
  }

  return new URL(path, API_ORIGIN).toString();
};

export const buildPreviewUrl = (size) => {
  if (!size?.previewUrl) {
    return "";
  }

  return buildBackendUrl(size.previewUrl);
};

export const createPreviewMessage = (type, payload) => {
  return {
    type,
    payload,
  };
};

export const sendPreviewMessage = (iframeElement, message) => {
  if (!iframeElement?.contentWindow || !message?.type) {
    return;
  }

  iframeElement.contentWindow.postMessage(message, API_ORIGIN);
};

export const createTextUpdateMessage = (textValues) => {
  return createPreviewMessage(MESSAGE_TYPES.updateText, textValues);
};

export const createBackgroundUpdateMessage = (backgroundState) => {
  return createPreviewMessage(MESSAGE_TYPES.updateBackground, backgroundState);
};

export const createImageUpdateMessage = (imageValues) => {
  return createPreviewMessage(MESSAGE_TYPES.updateImage, imageValues);
};

export const createImageAdjustmentsUpdateMessage = (imageAdjustments) => {
  return createPreviewMessage(MESSAGE_TYPES.updateImageAdjustments, imageAdjustments);
};

export const createImageVisibilityUpdateMessage = (hiddenImages) => {
  return createPreviewMessage(MESSAGE_TYPES.updateImageVisibility, hiddenImages);
};

export const createShapeAdjustmentsUpdateMessage = (shapeState) => {
  return createPreviewMessage(MESSAGE_TYPES.updateShapeAdjustments, shapeState);
};

export { MESSAGE_TYPES };
