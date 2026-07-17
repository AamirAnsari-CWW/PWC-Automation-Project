const express = require("express");

const projectController = require("../controllers/projectController");

const router = express.Router();

// Frontend source: client/src/services/projectService.js.
// Data source: server/data/projects.json through projectStoreService.
router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.post("/:id/duplicate", projectController.duplicateProject);

module.exports = router;
