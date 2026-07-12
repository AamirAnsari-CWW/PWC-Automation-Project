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

const getSizeInfo = async (sizeDirectoryPath, templateId, size, metadata) => {
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
  };
};

const normalizeTemplateMetadata = async ({ metadata, templateDirectoryPath, templateId, sizeDirectoryNames }) => {
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
