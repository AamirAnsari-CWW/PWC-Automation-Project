import axios from "axios";

import { API_BASE_URL } from "../constants/api";

export const exportBannerPackage = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/exports`, payload, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${payload.name || "banner-export"}.zip`;
  link.click();
  URL.revokeObjectURL(url);
};
