import axios from "axios";

import { API_BASE_URL } from "../constants/api";

export const uploadProjectImage = async (file) => {
  // Uploaded images are stored under server/uploads/projects/ and the backend
  // returns a public URL that is saved on the project payload.
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(`${API_BASE_URL}/uploads/project-image`, formData);
  return response.data.data;
};
