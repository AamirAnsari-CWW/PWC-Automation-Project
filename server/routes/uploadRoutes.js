const crypto = require("crypto");
const path = require("path");

const express = require("express");
const fs = require("fs-extra");
const multer = require("multer");

const { PROJECT_UPLOADS_ROOT } = require("../config/storagePaths");
const uploadController = require("../controllers/uploadController");

const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    await fs.ensureDir(PROJECT_UPLOADS_ROOT);
    callback(null, PROJECT_UPLOADS_ROOT);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post("/project-image", upload.single("image"), uploadController.uploadProjectImage);

module.exports = router;
