const path = require("path");

const { SERVER_ROOT } = require("./templatePaths");

const DATA_ROOT = path.join(SERVER_ROOT, "data");
const PROJECTS_FILE = path.join(DATA_ROOT, "projects.json");
const UPLOADS_ROOT = path.join(SERVER_ROOT, "uploads");
const PROJECT_UPLOADS_ROOT = path.join(UPLOADS_ROOT, "projects");
const EXPORTS_ROOT = path.join(SERVER_ROOT, "exports");

module.exports = {
  DATA_ROOT,
  EXPORTS_ROOT,
  PROJECT_UPLOADS_ROOT,
  PROJECTS_FILE,
  UPLOADS_ROOT,
};
