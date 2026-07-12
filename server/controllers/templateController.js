const templateService = require("../services/templateService");

const getTemplates = async (req, res, next) => {
  try {
    const templates = await templateService.getTemplates();
    res.json({ data: templates });
  } catch (error) {
    next(error);
  }
};

const getTemplateById = async (req, res, next) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    res.json({ data: template });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemplateById,
  getTemplates,
};
