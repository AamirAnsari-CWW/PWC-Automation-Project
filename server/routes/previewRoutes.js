const express = require("express");

const previewController = require("../controllers/previewController");

const router = express.Router();

router.get("/:templateId/:size/index.html", previewController.getPreviewHtml);
router.get("/:templateId/:size/*assetPath", previewController.getPreviewAsset);

module.exports = router;
