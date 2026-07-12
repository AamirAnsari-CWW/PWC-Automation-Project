const path = require("path");
const fs = require("fs-extra");

const { TEMPLATES_ROOT } = require("../config/templatePaths");
const HttpError = require("../utils/httpError");
const { injectPreviewRuntime } = require("./previewRuntimeService");

const SIZE_PATTERN = /^\d+x\d+$/;

const resolveTemplateSizeDirectory = async (templateId, size) => {
  if (!SIZE_PATTERN.test(size)) {
    throw new HttpError(400, "Invalid banner size.");
  }

  const nestedSizeDirectory = path.join(TEMPLATES_ROOT, templateId, size);
  const legacySizeDirectory = path.join(TEMPLATES_ROOT, size);

  if (await fs.pathExists(nestedSizeDirectory)) {
    return nestedSizeDirectory;
  }

  if (await fs.pathExists(legacySizeDirectory)) {
    return legacySizeDirectory;
  }

  throw new HttpError(404, "Banner size not found.");
};

const getDistDirectory = async (templateId, size) => {
  const sizeDirectory = await resolveTemplateSizeDirectory(templateId, size);
  const distDirectory = path.join(sizeDirectory, "dist");

  if (!(await fs.pathExists(distDirectory))) {
    throw new HttpError(404, "Compiled banner dist folder not found.");
  }

  return distDirectory;
};

const getPreviewHtml = async (templateId, size) => {
  const distDirectory = await getDistDirectory(templateId, size);
  const indexPath = path.join(distDirectory, "index.html");

  if (!(await fs.pathExists(indexPath))) {
    throw new HttpError(404, "Banner index.html not found.");
  }

  const html = await fs.readFile(indexPath, "utf8");

  return injectPreviewRuntime(html);
};

const getPreviewAssetPath = async (templateId, size, assetPath) => {
  const distDirectory = await getDistDirectory(templateId, size);
  const resolvedAssetPath = path.resolve(distDirectory, assetPath);

  if (!resolvedAssetPath.startsWith(distDirectory)) {
    throw new HttpError(400, "Invalid asset path.");
  }

  if (!(await fs.pathExists(resolvedAssetPath))) {
    throw new HttpError(404, "Preview asset not found.");
  }

  return resolvedAssetPath;
};

module.exports = {
  getPreviewAssetPath,
  getPreviewHtml,
};
