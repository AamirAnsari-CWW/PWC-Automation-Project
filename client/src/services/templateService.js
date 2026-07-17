import axios from "axios";

import { API_BASE_URL } from "../constants/api";

// Template data starts on the backend in server/templates/template.json plus
// the size folders under server/templates/. This mapper gives the UI stable
// defaults even when older template metadata is missing optional fields.
const mapTemplateFromApi = (template) => {
  const supportedSizes = template.sizeDetails?.length
    ? template.sizeDetails.map((size) => size.id)
    : template.sizes || [];

  return {
    ...template,
    category: template.category || "HTML5 Banner",
    description: template.description || "Real HTML5 banner template loaded from the backend.",
    status: template.status || "Approved",
    supportedSizes,
    updatedAt: template.updatedAt || "",
  };
};

export const getTemplates = async () => {
  // GET /api/templates is served by server/routes/templateRoutes.js and
  // server/services/templateService.js, which scans template folders on disk.
  const response = await axios.get(`${API_BASE_URL}/templates`);
  return response.data.data.map(mapTemplateFromApi);
};

export const getTemplateById = async (templateId) => {
  // Used by BannerEditor when the route contains /editor/:templateId/:size.
  const response = await axios.get(`${API_BASE_URL}/templates/${templateId}`);
  return mapTemplateFromApi(response.data.data);
};
