import {
  createBackgroundUpdateMessage,
  createImageAdjustmentsUpdateMessage,
  createImageVisibilityUpdateMessage,
  createImageUpdateMessage,
  createShapeAdjustmentsUpdateMessage,
  createTextUpdateMessage,
  sendPreviewMessage,
} from "./previewService";

export const createBannerBridge = (iframeElement) => {
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

    updateText(textValues) {
      sendPreviewMessage(iframeElement, createTextUpdateMessage(textValues));
    },
  };
};
