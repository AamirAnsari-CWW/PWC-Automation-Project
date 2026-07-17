const fs = require("fs-extra");

const { PROJECTS_FILE } = require("../config/storagePaths");

const readProjects = async () => {
  // Local JSON storage keeps development simple. Replace this service first if
  // the project later moves to a database.
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
