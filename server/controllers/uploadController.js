const imageService = require("../services/imageService");

const uploadProjectImage = async (req, res, next) => {
  try {
    const image = await imageService.createProjectUploadPath(req.file);
    res.status(201).json({ data: image });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProjectImage,
};
