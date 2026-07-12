const path = require("path");

const SERVER_ROOT = path.resolve(__dirname, "..");
const TEMPLATES_ROOT = path.join(SERVER_ROOT, "templates");

module.exports = {
  SERVER_ROOT,
  TEMPLATES_ROOT,
};
