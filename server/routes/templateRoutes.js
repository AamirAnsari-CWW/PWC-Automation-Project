const express = require("express");

const templateController = require("../controllers/templateController");

const router = express.Router();

// Frontend source: client/src/services/templateService.js.
// Data source: server/services/templateService.js reads server/templates/.
router.get("/", templateController.getTemplates);
router.get("/:id", templateController.getTemplateById);

module.exports = router;
