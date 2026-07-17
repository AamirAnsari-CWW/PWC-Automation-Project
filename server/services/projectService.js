const crypto = require("crypto");

const HttpError = require("../utils/httpError");
const projectStoreService = require("./projectStoreService");

const createTimestamp = () => new Date().toISOString();

// This is the backend contract for saved editor state. When adding a feature,
// include the field here, in EditorContext, and in BannerEditor projectPayload.
const normalizeProjectPayload = (payload) => ({
  name: payload.name?.trim() || "Untitled Banner Project",
  templateId: payload.templateId,
  templateName: payload.templateName,
  size: payload.size,
  texts: payload.texts || {},
  images: payload.images || {},
  background: payload.background || { x: 0, y: 0, scale: 1 },
  compositionTransform: payload.compositionTransform || payload.background || { x: 0, y: 0, scale: 1 },
  frame1BackgroundTransform: payload.frame1BackgroundTransform || { x: 0, y: 0, scale: 1 },
  hiddenImages: payload.hiddenImages || {},
  imageAdjustments: payload.imageAdjustments || {},
  shapeAdjustments: payload.shapeAdjustments || {},
  shapeDefinitions: payload.shapeDefinitions || {},
  siloOffset: payload.siloOffset || { x: 0, y: 0 },
  createdBy: payload.createdBy || "local-user",
});

const getProjects = async () => {
  return projectStoreService.readProjects();
};

const getProjectById = async (projectId) => {
  const projects = await getProjects();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    throw new HttpError(404, "Project not found.");
  }

  return project;
};

const createProject = async (payload) => {
  // New projects are inserted first so dashboards/project lists naturally show
  // the most recent work at the top.
  const projects = await getProjects();
  const timestamp = createTimestamp();
  const project = {
    id: crypto.randomUUID(),
    ...normalizeProjectPayload(payload),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  projects.unshift(project);
  await projectStoreService.writeProjects(projects);

  return project;
};

const updateProject = async (projectId, payload) => {
  // Merge with the existing record so partial client updates do not drop fields
  // introduced by future editor features.
  const projects = await getProjects();
  const projectIndex = projects.findIndex((item) => item.id === projectId);

  if (projectIndex === -1) {
    throw new HttpError(404, "Project not found.");
  }

  const currentProject = projects[projectIndex];
  const updatedProject = {
    ...currentProject,
    ...normalizeProjectPayload({ ...currentProject, ...payload }),
    id: currentProject.id,
    createdAt: currentProject.createdAt,
    updatedAt: createTimestamp(),
  };

  projects[projectIndex] = updatedProject;
  await projectStoreService.writeProjects(projects);

  return updatedProject;
};

const deleteProject = async (projectId) => {
  const projects = await getProjects();
  const nextProjects = projects.filter((item) => item.id !== projectId);

  if (nextProjects.length === projects.length) {
    throw new HttpError(404, "Project not found.");
  }

  await projectStoreService.writeProjects(nextProjects);
};

const duplicateProject = async (projectId) => {
  const project = await getProjectById(projectId);

  return createProject({
    ...project,
    name: `${project.name} Copy`,
  });
};

module.exports = {
  createProject,
  deleteProject,
  duplicateProject,
  getProjectById,
  getProjects,
  updateProject,
};
