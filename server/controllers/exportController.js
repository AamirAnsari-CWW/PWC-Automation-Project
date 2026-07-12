const exportService = require("../services/exportService");
const projectService = require("../services/projectService");

const exportProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    const exportedFile = await exportService.createExport(project);

    res.download(exportedFile.zipPath, exportedFile.fileName);
  } catch (error) {
    next(error);
  }
};

const exportPayload = async (req, res, next) => {
  try {
    const exportedFile = await exportService.createExport(req.body);

    res.download(exportedFile.zipPath, exportedFile.fileName);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportPayload,
  exportProject,
};
