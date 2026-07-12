const projectService = require("../services/projectService");

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json({ data: project });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects();
    res.json({ data: projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json({ data: project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json({ data: project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const duplicateProject = async (req, res, next) => {
  try {
    const project = await projectService.duplicateProject(req.params.id);
    res.status(201).json({ data: project });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  deleteProject,
  duplicateProject,
  getProjectById,
  getProjects,
  updateProject,
};
