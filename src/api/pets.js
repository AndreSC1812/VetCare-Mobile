import axios from "axios";
import { API_URL } from "@env";

// Función para obtener las mascotas de un cliente específico
export const getPetsByClient = async (clientId) => {
  try {
    const response = await axios.get(`${API_URL}/api/pets/${clientId}`);
    return response.data.pets; // Retornamos solo los datos de las mascotas
  } catch (error) {
    throw error; // Lanzamos el error para que lo maneje quien llame a esta función
  }
};

// Función para obtener los detalles de una mascota por su ID
export const getPetById = async (petId) => {
  try {
    const response = await axios.get(`${API_URL}/api/pets/pet/${petId}`);
    return response.data.pet; // Retornamos los datos de la mascota
  } catch (error) {
    throw error; // Lanzamos el error para que lo maneje quien llame a esta función
  }
};
