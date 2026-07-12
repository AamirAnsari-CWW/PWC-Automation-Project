import axios from "axios";

import { API_BASE_URL } from "../constants/api";

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
  const response = await axios.get(`${API_BASE_URL}/templates`);
  return response.data.data.map(mapTemplateFromApi);
};

export const getTemplateById = async (templateId) => {
  const response = await axios.get(`${API_BASE_URL}/templates/${templateId}`);
  return mapTemplateFromApi(response.data.data);
};
