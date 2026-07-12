const path = require("path");
const fs = require("fs-extra");

const { PROJECT_UPLOADS_ROOT } = require("../config/storagePaths");

const createProjectUploadPath = async (file) => {
  await fs.ensureDir(PROJECT_UPLOADS_ROOT);

  return {
    originalName: file.originalname,
    storedName: file.filename,
    path: file.path,
    publicUrl: `/uploads/projects/${file.filename}`,
  };
};

const resolveUploadedImagePath = async (publicUrl) => {
  if (!publicUrl) {
    return null;
  }

  const fileName = path.basename(publicUrl);
  const imagePath = path.join(PROJECT_UPLOADS_ROOT, fileName);

  if (!(await fs.pathExists(imagePath))) {
    return null;
  }

  return imagePath;
};

module.exports = {
  createProjectUploadPath,
  resolveUploadedImagePath,
};
