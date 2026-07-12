const fs = require("fs-extra");

const { PROJECTS_FILE } = require("../config/storagePaths");

const readProjects = async () => {
  await fs.ensureFile(PROJECTS_FILE);

  try {
    return await fs.readJson(PROJECTS_FILE);
  } catch {
    return [];
  }
};

const writeProjects = async (projects) => {
  await fs.outputJson(PROJECTS_FILE, projects, { spaces: 2 });
  return projects;
};

module.exports = {
  readProjects,
  writeProjects,
};
