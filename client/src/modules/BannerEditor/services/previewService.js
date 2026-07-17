const MESSAGE_TYPES = Object.freeze({
  updateBackground: "UPDATE_BACKGROUND",
  updateImageAdjustments: "UPDATE_IMAGE_ADJUSTMENTS",
  updateImageVisibility: "UPDATE_IMAGE_VISIBILITY",
  updateImage: "UPDATE_IMAGE",
  updateShapeAdjustments: "UPDATE_SHAPE_ADJUSTMENTS",
  updateSiloOffset: "UPDATE_SILO_OFFSET",
  updateText: "UPDATE_TEXT",
});

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:5001";

export const buildBackendUrl = (path) => {
  // Backend responses usually use public paths like /templates/... or /uploads/...
  // Convert them to absolute URLs so images and iframes load from the API host.
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
  // React never mutates the banner DOM directly. It sends typed messages to the
  // runtime injected by server/services/previewRuntimeService.js.
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

export const createSiloOffsetUpdateMessage = (siloOffset) => {
  return createPreviewMessage(MESSAGE_TYPES.updateSiloOffset, siloOffset);
};

export { MESSAGE_TYPES };
