const path = require("path");
const fs = require("fs-extra");

const { TEMPLATES_ROOT } = require("../config/templatePaths");
const HttpError = require("../utils/httpError");

const TEMPLATE_JSON = "template.json";
const SIZE_PATTERN = /^\d+x\d+$/;
const DEFAULT_TEMPLATE_ID = "energy-campaign";
const DEFAULT_TEMPLATE_NAME = "Energy Campaign";
const DEFAULT_EDITABLE_TEXTS = ["d2", "d3", "d5", "d7"];
const DEFAULT_EDITABLE_IMAGES = ["mainbg.jpg", "silo.png"];
const DEFAULT_SHAPE_DEFINITIONS = {};
const DEFAULT_ANIMATION_FILE = "src/js/main.js";
const DEFAULT_BACKGROUND_TRANSFORM = { x: 0, y: 0, scale: 1 };

// Template metadata is file-system backed. The service supports the current
// root-level template.json layout and a nested future layout where each template
// has its own metadata file and size folders.
const toTemplateId = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const isDirectory = async (directoryPath) => {
  try {
    const stats = await fs.stat(directoryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

const getDirectoryNames = async (directoryPath) => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("."));
};

const readJsonIfExists = async (filePath) => {
  const exists = await fs.pathExists(filePath);

  if (!exists) {
    return null;
  }

  return fs.readJson(filePath);
};

const parseNumberProperty = (objectSource, propertyName, fallback) => {
  const match = objectSource.match(new RegExp(`${propertyName}\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`));

  return match ? Number(match[1]) : fallback;
};

const parseTransformFromObjectSource = (objectSource) => ({
  x: parseNumberProperty(objectSource, "x", DEFAULT_BACKGROUND_TRANSFORM.x),
  y: parseNumberProperty(objectSource, "y", DEFAULT_BACKGROUND_TRANSFORM.y),
  scale: parseNumberProperty(objectSource, "scale", DEFAULT_BACKGROUND_TRANSFORM.scale),
});

const getBackgroundDefaults = async (sizeDirectoryPath) => {
  // The editor uses these values to match the original animation's first/final
  // background positions before a developer adds manual adjustments.
  const bannerSourcePath = path.join(sizeDirectoryPath, "src", "js", "banners.js");

  if (!(await fs.pathExists(bannerSourcePath))) {
    return {
      final: DEFAULT_BACKGROUND_TRANSFORM,
      frame1: DEFAULT_BACKGROUND_TRANSFORM,
    };
  }

  const source = await fs.readFile(bannerSourcePath, "utf8");
  const frame1Match = source.match(/\.set\(\s*d1\s*,\s*\{([^}]*(?:scale|x|y)[^}]*)\}/);
  const finalMatch = source.match(/\.to\(\s*\[[^\]]*d1[^\]]*\]\s*,\s*[^,]+,\s*\{([^}]*(?:scale|x|y)[^}]*)\}/);

  return {
    final: finalMatch ? parseTransformFromObjectSource(finalMatch[1]) : DEFAULT_BACKGROUND_TRANSFORM,
    frame1: frame1Match ? parseTransformFromObjectSource(frame1Match[1]) : DEFAULT_BACKGROUND_TRANSFORM,
  };
};

const getSizeInfo = async (sizeDirectoryPath, templateId, size, metadata) => {
  // This object is sent to the frontend as sizeDetails. Add fields here when a
  // UI feature needs per-size template data.
  const distIndexPath = path.join(sizeDirectoryPath, "dist", "index.html");
  const sourceIndexPath = path.join(sizeDirectoryPath, "src", "index.html");
  const previewImagePath = path.join(sizeDirectoryPath, `${size}.jpg`);
  const editableTexts = metadata?.sizeEditableTexts?.[size] || metadata?.editableTexts || DEFAULT_EDITABLE_TEXTS;

  return {
    id: size,
    width: Number(size.split("x")[0]),
    height: Number(size.split("x")[1]),
    editableTexts,
    hasDistIndex: await fs.pathExists(distIndexPath),
    hasSourceIndex: await fs.pathExists(sourceIndexPath),
    previewImageUrl: (await fs.pathExists(previewImagePath)) ? `/templates/${size}/${size}.jpg` : null,
    previewUrl: (await fs.pathExists(distIndexPath)) ? `/templates/${templateId}/${size}/index.html` : null,
    backgroundDefaults: await getBackgroundDefaults(sizeDirectoryPath),
  };
};

const normalizeTemplateMetadata = async ({ metadata, templateDirectoryPath, templateId, sizeDirectoryNames }) => {
  // The frontend expects a consistent shape regardless of how complete the
  // template.json file is, so defaults are applied in one place here.
  const sizes = metadata?.sizes?.length ? metadata.sizes : sizeDirectoryNames;

  return {
    id: metadata?.id || templateId,
    name: metadata?.name || DEFAULT_TEMPLATE_NAME,
    sizes,
    editableTexts: metadata?.editableTexts || DEFAULT_EDITABLE_TEXTS,
    editableImages: metadata?.editableImages || DEFAULT_EDITABLE_IMAGES,
    shapeDefinitions: metadata?.shapeDefinitions || DEFAULT_SHAPE_DEFINITIONS,
    animationFile: metadata?.animationFile || DEFAULT_ANIMATION_FILE,
    templatePath: path.relative(TEMPLATES_ROOT, templateDirectoryPath) || ".",
    sizeDetails: await Promise.all(
      sizes.map((size) => getSizeInfo(path.join(templateDirectoryPath, size), metadata?.id || templateId, size, metadata))
    ),
  };
};

const getLegacyRootTemplate = async () => {
  const rootDirectoryNames = await getDirectoryNames(TEMPLATES_ROOT);
  const sizeDirectoryNames = rootDirectoryNames.filter((name) => SIZE_PATTERN.test(name));

  if (!sizeDirectoryNames.length) {
    return null;
  }

  const metadata = await readJsonIfExists(path.join(TEMPLATES_ROOT, TEMPLATE_JSON));

  return normalizeTemplateMetadata({
    metadata,
    templateDirectoryPath: TEMPLATES_ROOT,
    templateId: metadata?.id || DEFAULT_TEMPLATE_ID,
    sizeDirectoryNames,
  });
};

const getNestedTemplates = async () => {
  const rootDirectoryNames = await getDirectoryNames(TEMPLATES_ROOT);
  const templateDirectoryNames = rootDirectoryNames.filter((name) => !SIZE_PATTERN.test(name));

  const templates = await Promise.all(
    templateDirectoryNames.map(async (directoryName) => {
      const templateDirectoryPath = path.join(TEMPLATES_ROOT, directoryName);
      const metadata = await readJsonIfExists(path.join(templateDirectoryPath, TEMPLATE_JSON));

      if (!metadata) {
        return null;
      }

      const sizeDirectoryNames = (await getDirectoryNames(templateDirectoryPath)).filter((name) =>
        SIZE_PATTERN.test(name)
      );

      return normalizeTemplateMetadata({
        metadata,
        templateDirectoryPath,
        templateId: metadata.id || toTemplateId(metadata.name || directoryName),
        sizeDirectoryNames,
      });
    })
  );

  return templates.filter(Boolean);
};

const getTemplates = async () => {
  const templatesRootExists = await isDirectory(TEMPLATES_ROOT);

  if (!templatesRootExists) {
    throw new HttpError(500, "Templates directory does not exist.");
  }

  const nestedTemplates = await getNestedTemplates();
  const legacyRootTemplate = await getLegacyRootTemplate();

  return legacyRootTemplate ? [legacyRootTemplate, ...nestedTemplates] : nestedTemplates;
};

const getTemplateById = async (templateId) => {
  const templates = await getTemplates();
  const template = templates.find((item) => item.id === templateId);

  if (!template) {
    throw new HttpError(404, "Template not found.");
  }

  return template;
};

module.exports = {
  getTemplateById,
  getTemplates,
};
