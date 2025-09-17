import { API_URL } from "@env";
import axios from "axios";

// Registration request
export const registerRequest = (user) => {
  return axios.post(`${API_URL}/api/auth/register`, user);
};

// Login request
export const loginRequest = (user) => {
  return axios.post(`${API_URL}/api/auth/login`, user);
};

// Get user profile
export const getProfile = (token) => {
  return axios.get(`${API_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`, // Send token in headers
    },
  });
};
