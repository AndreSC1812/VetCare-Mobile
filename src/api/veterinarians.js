import axios from "axios";
import { API_URL } from "@env";

// Function to get the list of veterinarians
export const getVeterinarians = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/veterinarians`);
    return response.data; // Return the data (veterinarians)
  } catch (error) {
    throw error; // Re-throw error for handling in the caller
  }
};

// Function to get a veterinarian by ID
export const getVeterinarianById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/veterinarians/${id}`);
    return response.data; // Return the veterinarian data
  } catch (error) {
    throw error; // Re-throw error for handling in the caller
  }
};
