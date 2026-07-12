import axios from "axios";

import { API_BASE_URL } from "../constants/api";

export const uploadProjectImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(`${API_BASE_URL}/uploads/project-image`, formData);
  return response.data.data;
};
