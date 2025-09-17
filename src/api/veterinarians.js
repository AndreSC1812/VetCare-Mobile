import axios from "axios";
import { API_URL } from "@env";

// Función para obtener la lista de veterinarios
export const getVeterinarians = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/veterinarians`);
    return response.data; // Retornamos los datos (veterinarios)
  } catch (error) {
    throw error; // Lanzamos el error para que lo maneje quien llame a esta función
  }
};

// Función para obtener un veterinario por ID
export const getVeterinarianById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/veterinarians/${id}`);
    return response.data; // Retornamos los datos del veterinario
  } catch (error) {
    throw error; // Lanzamos el error para que lo maneje quien llame a esta función
  }
};
