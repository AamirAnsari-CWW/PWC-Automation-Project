const fs = require("fs-extra");
const archiverModule = require("archiver");

const createArchive = () => {
  if (typeof archiverModule === "function") {
    return archiverModule("zip", { zlib: { level: 9 } });
  }

  return new archiverModule.ZipArchive({ zlib: { level: 9 } });
};

const createZipFromDirectory = async (sourceDirectory, outputPath) => {
  await fs.ensureDir(require("path").dirname(outputPath));

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = createArchive();

    output.on("close", () => resolve(outputPath));
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(sourceDirectory, false);
    archive.finalize();
  });
};

module.exports = {
  createZipFromDirectory,
};
