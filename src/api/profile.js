// api/profile.js
import axios from "axios";
import { API_URL } from "@env";

// Upload profile image
export const uploadProfileImage = (token, formData) => {
  return axios.post(`${API_URL}/api/profile/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update profile data
export const updateProfileData = (token, data) => {
  return axios.put(`${API_URL}/api/profile/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
