const RUNTIME_MARKER = "<!-- Banner Automation Preview Runtime -->";

const getPreviewRuntimeScript = () => {
  return `
${RUNTIME_MARKER}
<script>
(function () {
  var MESSAGE_TYPES = {
    updateBackground: "UPDATE_BACKGROUND",
    updateImageAdjustments: "UPDATE_IMAGE_ADJUSTMENTS",
    updateImageVisibility: "UPDATE_IMAGE_VISIBILITY",
    updateImage: "UPDATE_IMAGE",
    updateShapeAdjustments: "UPDATE_SHAPE_ADJUSTMENTS",
    updateText: "UPDATE_TEXT"
  };
  var state = {
    background: null,
    hiddenImages: {},
    imageAdjustments: {},
    images: {},
    shapeAdjustments: {},
    shapeDefinitions: {},
    text: {}
  };

  function getEditableElement(key) {
    return document.getElementById(key) || document.querySelector("." + key);
  }

function updateText(payload) {
  console.log("UPDATE_TEXT received:", payload);

  state.text = Object.assign({}, state.text, payload || {});

  Object.keys(state.text).forEach(function (key) {
    var element = getEditableElement(key);

    if (!element) {
      console.log("Element not found:", key);
      return;
    }

    console.log("Updating", key, "to", state.text[key]);

    if (typeof window.updateTextReveal === "function") {
      window.updateTextReveal(element, state.text[key]);
      return;
    }

    element.textContent = state.text[key];
  });
}

  function updateImage(payload) {
    state.images = Object.assign({}, state.images, payload || {});

    Object.keys(state.images).forEach(function (key) {
      var imageName = key.indexOf(".") === -1 ? key : key.split(".")[0];
      var image = document.querySelector(
        '[data-banner-image-key="' + key + '"] img, img[data-banner-image-key="' + key + '"], img[src*="' + key + '"], img[src*="' + imageName + '"]'
      );
      var layer = image && image.closest('div[id^="d"]');

      if (!image) {
        return;
      }

      image.dataset.bannerImageKey = key;

      if (layer) {
        layer.dataset.bannerImageKey = key;
      }

      image.onload = function () {
        applyAdjustment(findImageTarget(key), key === "mainbg.jpg" || key === "silo.png" ? state.background : state.imageAdjustments[key], key);
      };

      if (image.src !== state.images[key]) {
        image.src = state.images[key];
      }

      applyAdjustment(findImageTarget(key), key === "mainbg.jpg" || key === "silo.png" ? state.background : state.imageAdjustments[key], key);
    });
  }

  function findImageTarget(key) {
    var imageName = key.indexOf(".") === -1 ? key : key.split(".")[0];
    var keyedElement = document.querySelector('[data-banner-image-key="' + key + '"]');
    var image =
      (keyedElement && keyedElement.tagName === "IMG" ? keyedElement : keyedElement && keyedElement.querySelector("img")) ||
      document.querySelector('img[src*="' + key + '"], img[src*="' + imageName + '"]');
    var layer = (keyedElement && keyedElement.closest('div[id^="d"]')) || (image && image.closest('div[id^="d"]'));

    return {
      image: image,
      layer:
        layer ||
        image ||
      document.getElementById(imageName) ||
      document.getElementById(key) ||
      document.querySelector("." + imageName) ||
      document.querySelector("." + key)
    };
  }

  function getBaseNumber(element, key) {
    if (!element) {
      return 0;
    }

    var dataKey = "bannerBase" + key.charAt(0).toUpperCase() + key.slice(1);

    if (element.dataset[dataKey] === undefined) {
      var computed = window.getComputedStyle(element);
      var rawValue = element.style[key] || computed[key] || "0";

      element.dataset[dataKey] = String(parseFloat(rawValue) || 0);
    }

    return Number(element.dataset[dataKey] || 0);
  }

  function getBaseTransform(element) {
    if (!element) {
      return "";
    }

    if (element.dataset.bannerBaseTransform === undefined) {
      var transform = element.style.transform || "";

      element.dataset.bannerBaseTransform = transform === "none" ? "" : transform;
    }

    return element.dataset.bannerBaseTransform || "";
  }

  function hasAdjustment(adjustment) {
    if (!adjustment) {
      return false;
    }

    return (
      adjustment.visible === false ||
      Number(adjustment.x || 0) !== 0 ||
      Number(adjustment.y || 0) !== 0 ||
      Number(adjustment.scale || 1) !== 1 ||
      Number(adjustment.rotation || 0) !== 0
    );
  }

  function normalizeShapeAdjustment(adjustment) {
    return Object.assign({ x: 0, y: 0, scale: 1, rotation: 0, visible: true }, adjustment || {});
  }

  function getBaseDisplay(element) {
    if (!element) {
      return "";
    }

    if (element.dataset.bannerBaseDisplay === undefined) {
      var display = element.style.display || window.getComputedStyle(element).display || "";

      element.dataset.bannerBaseDisplay = display === "none" ? "" : display;
    }

    return element.dataset.bannerBaseDisplay || "";
  }

  function toShapeSelectors(shapeName, definition) {
    if (Array.isArray(definition)) {
      return definition.concat('[data-shape="' + shapeName + '"]');
    }

    if (typeof definition === "string" && definition) {
      return [definition, '[data-shape="' + shapeName + '"]'];
    }

    return ['[data-shape="' + shapeName + '"]'];
  }

  function findShapeElements(shapeName) {
    var definition = state.shapeDefinitions[shapeName];
    var selectors = toShapeSelectors(shapeName, definition);
    var elements = [];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        if (elements.indexOf(element) === -1) {
          elements.push(element);
        }
      });
    });

    return elements;
  }

  function applyShapeAdjustment(shapeName) {
    var elements = findShapeElements(shapeName);

    if (!elements.length) {
      return;
    }

    var adjustment = normalizeShapeAdjustment(state.shapeAdjustments[shapeName]);

    elements.forEach(function (element) {
      var transform =
        getBaseTransform(element) +
        " translate(" +
        Number(adjustment.x || 0) +
        "px, " +
        Number(adjustment.y || 0) +
        "px) scale(" +
        Number(adjustment.scale || 1) +
        ") rotate(" +
        Number(adjustment.rotation || 0) +
        "deg)";

      element.style.display = adjustment.visible === false ? "none" : getBaseDisplay(element);
      element.style.transformOrigin = element.style.transformOrigin || "center center";
      element.style.transform = transform;
    });
  }

  function applyAdjustment(target, adjustment, key) {
    if (!target || !target.layer || !adjustment || (key !== "mainbg.jpg" && !hasAdjustment(adjustment))) {
      return;
    }

    var x = Number(adjustment.x || 0);
    var y = Number(adjustment.y || 0);
    var scale = Number(adjustment.scale || 1);
    var rotation = Number(adjustment.rotation || 0);
    var layer = target.layer;
    var scaleElement = target.image || target.layer;

    if (target.image) {
      var imageTransform = "translate(" + x + "px, " + y + "px) scale(" + scale + ") rotate(" + rotation + "deg)";

      target.layer.style.display = adjustment.visible === false ? "none" : getBaseDisplay(target.layer);
      target.layer.style.overflow = "hidden";
      if (window.getComputedStyle(target.layer).position === "static") {
        target.layer.style.position = "relative";
      }
      target.image.style.position = "absolute";
      target.image.style.left = "0";
      target.image.style.top = "0";
      target.image.style.width = target.image.naturalWidth ? target.image.naturalWidth + "px" : "auto";
      target.image.style.height = target.image.naturalHeight ? target.image.naturalHeight + "px" : "auto";
      target.image.style.maxWidth = "none";
      target.image.style.maxHeight = "none";
      target.image.style.objectFit = "initial";
      target.image.style.transformOrigin = "top left";
      target.image.style.transform = imageTransform;
      return;
    }

    var left = getBaseNumber(layer, "left") + x;
    var top = getBaseNumber(layer, "top") + y;
    var transform = getBaseTransform(scaleElement) + " scale(" + scale + ") rotate(" + rotation + "deg)";

    layer.style.display = adjustment.visible === false ? "none" : getBaseDisplay(layer);
    layer.style.left = left + "px";
    layer.style.top = top + "px";
    if (scaleElement.style.transformOrigin !== "center center") {
      scaleElement.style.transformOrigin = "center center";
    }

    if (scaleElement.style.transform !== transform) {
      scaleElement.style.transform = transform;
    }
  }

  function updateImageVisibility(payload) {
    state.hiddenImages = Object.assign({}, state.hiddenImages, payload || {});

    Object.keys(state.hiddenImages).forEach(function (key) {
      var target = findImageTarget(key);

      if (!target.layer) {
        return;
      }

      target.layer.style.display = state.hiddenImages[key] ? "none" : "block";
    });
  }

  function updateImageAdjustments(payload) {
    state.imageAdjustments = Object.assign({}, state.imageAdjustments, payload || {});

    Object.keys(state.imageAdjustments).forEach(function (key) {
      if (key === "mainbg.jpg" || key === "silo.png") {
        return;
      }

      applyAdjustment(findImageTarget(key), state.imageAdjustments[key], key);
    });
  }

  function updateShapeAdjustments(payload) {
    var nextPayload = payload || {};

    state.shapeDefinitions = Object.assign({}, state.shapeDefinitions, nextPayload.definitions || {});
    state.shapeAdjustments = Object.assign(
      {},
      state.shapeAdjustments,
      nextPayload.adjustments || (nextPayload.definitions ? {} : nextPayload)
    );

    Object.keys(state.shapeDefinitions).forEach(applyShapeAdjustment);
  }

  function updateBackground(payload) {
    state.background = Object.assign({}, state.background || {}, payload || {});

    var background = findImageTarget("mainbg.jpg");
    var silo = findImageTarget("silo.png");

    if (!state.background) {
      return;
    }

    applyAdjustment(background, state.background, "mainbg.jpg");
    applyAdjustment(silo, state.background, "silo.png");
  }

  function applyState() {
    updateText({});
    updateImage({});
    updateImageVisibility({});
    updateImageAdjustments({});
    updateShapeAdjustments({});
    updateBackground({});
  }

  window.addEventListener("message", function (event) {
    var message = event.data || {};

    if (message.type === MESSAGE_TYPES.updateText) {
      updateText(message.payload);
    }

    if (message.type === MESSAGE_TYPES.updateImage) {
      updateImage(message.payload);
    }

    if (message.type === MESSAGE_TYPES.updateImageVisibility) {
      updateImageVisibility(message.payload);
    }

    if (message.type === MESSAGE_TYPES.updateImageAdjustments) {
      updateImageAdjustments(message.payload);
    }

    if (message.type === MESSAGE_TYPES.updateShapeAdjustments) {
      updateShapeAdjustments(message.payload);
    }

    if (message.type === MESSAGE_TYPES.updateBackground) {
      updateBackground(message.payload);
    }
  });

  if ("MutationObserver" in window) {
    new MutationObserver(applyState).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
</script>`;
};

const injectPreviewRuntime = (html) => {
  if (html.includes(RUNTIME_MARKER)) {
    return html;
  }

  const runtimeScript = getPreviewRuntimeScript();

  if (html.includes("</body>")) {
    return html.replace("</body>", `${runtimeScript}\n</body>`);
  }

  return `${html}\n${runtimeScript}`;
};

module.exports = {
  injectPreviewRuntime,
};
