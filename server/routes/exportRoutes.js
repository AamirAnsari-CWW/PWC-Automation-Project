const express = require("express");

const exportController = require("../controllers/exportController");

const router = express.Router();

router.post("/", exportController.exportPayload);
router.post("/projects/:id", exportController.exportProject);

module.exports = router;
