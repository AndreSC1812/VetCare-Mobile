import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage to access local storage
import { API_URL } from "@env";

// Get reports of a specific pet
export const getReportsByPet = async (petId) => {
  try {
    const token = await AsyncStorage.getItem("token"); // Get stored token

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    return axios.get(`${API_URL}/api/reports/pet/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in headers
      },
    });
  } catch (error) {
    console.error("Error fetching pet reports:", error);
    throw error; // Re-throw error for component handling
  }
};

// Get a report by ID
export const getReportById = async (reportId) => {
  try {
    const token = await AsyncStorage.getItem("token"); // Get stored token

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    return axios.get(`${API_URL}/api/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in headers
      },
    });
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    throw error; // Re-throw error for component handling
  }
};

// Update a report
export const updateReportRequest = async (reportId, updatedReportData) => {
  const token = await AsyncStorage.getItem("token"); // Get token

  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const response = await axios.put(
      `${API_URL}/api/reports/${reportId}`, // Update report route
      updatedReportData, // Updated report data
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
      }
    );

    return response.data.report; // Return updated report
  } catch (error) {
    console.error("Error updating report:", error);
    throw new Error("Failed to update the report.");
  }
};
