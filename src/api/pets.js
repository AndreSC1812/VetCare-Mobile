import axios from "axios";
import { API_URL } from "@env";

// Function to get pets for a specific client
export const getPetsByClient = async (clientId) => {
  try {
    const response = await axios.get(`${API_URL}/api/pets/${clientId}`);
    return response.data.pets; // Return only the pet data
  } catch (error) {
    throw error; // Throw the error to be handled by the caller
  }
};

// Function to get details of a pet by its ID
export const getPetById = async (petId) => {
  try {
    const response = await axios.get(`${API_URL}/api/pets/pet/${petId}`);
    return response.data.pet; // Return the pet data
  } catch (error) {
    throw error; // Throw the error to be handled by the caller
  }
};
