const previewService = require("../services/previewService");

const getPreviewHtml = async (req, res, next) => {
  try {
    const html = await previewService.getPreviewHtml(req.params.templateId, req.params.size);

    res.type("html").send(html);
  } catch (error) {
    next(error);
  }
};

const getPreviewAsset = async (req, res, next) => {
  try {
    const requestedAssetPath = Array.isArray(req.params.assetPath)
      ? req.params.assetPath.join("/")
      : req.params.assetPath;

    const resolvedAssetPath = await previewService.getPreviewAssetPath(
      req.params.templateId,
      req.params.size,
      requestedAssetPath
    );

    res.sendFile(resolvedAssetPath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreviewAsset,
  getPreviewHtml,
};
