import {
  createBackgroundUpdateMessage,
  createImageAdjustmentsUpdateMessage,
  createImageVisibilityUpdateMessage,
  createImageUpdateMessage,
  createShapeAdjustmentsUpdateMessage,
  createSiloOffsetUpdateMessage,
  createTextUpdateMessage,
  sendPreviewMessage,
} from "./previewService";

export const createBannerBridge = (iframeElement) => {
  // Thin adapter between React state and the preview iframe runtime. Add a new
  // preview feature by creating a message type, a bridge method, and a runtime
  // handler in server/services/previewRuntimeService.js.
  return {
    updateBackground(backgroundState) {
      sendPreviewMessage(iframeElement, createBackgroundUpdateMessage(backgroundState));
    },

    updateImages(imageValues) {
      sendPreviewMessage(iframeElement, createImageUpdateMessage(imageValues));
    },

    updateImageAdjustments(imageAdjustments) {
      sendPreviewMessage(iframeElement, createImageAdjustmentsUpdateMessage(imageAdjustments));
    },

    updateImageVisibility(hiddenImages) {
      sendPreviewMessage(iframeElement, createImageVisibilityUpdateMessage(hiddenImages));
    },

    updateShapeAdjustments(shapeState) {
      sendPreviewMessage(iframeElement, createShapeAdjustmentsUpdateMessage(shapeState));
    },

    updateSiloOffset(siloOffset) {
      sendPreviewMessage(iframeElement, createSiloOffsetUpdateMessage(siloOffset));
    },

    updateText(textValues) {
      sendPreviewMessage(iframeElement, createTextUpdateMessage(textValues));
    },
  };
};
