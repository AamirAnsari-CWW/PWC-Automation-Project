import axios from "axios";

import { API_BASE_URL } from "../constants/api";

export const createProject = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/projects`, payload);
  return response.data.data;
};

export const updateProject = async (projectId, payload) => {
  const response = await axios.put(`${API_BASE_URL}/projects/${projectId}`, payload);
  return response.data.data;
};

export const getProjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/projects`);
  return response.data.data;
};

export const getProjectById = async (projectId) => {
  const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
  return response.data.data;
};

export const deleteProject = async (projectId) => {
  await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
};

export const duplicateProject = async (projectId) => {
  const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/duplicate`);
  return response.data.data;
};
