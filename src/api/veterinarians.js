import axios from "axios";

// Aquí definimos la URL base de la API
const API_URL = "http://192.168.0.29:3000"; // Cambia por la URL real de la API en producción si es necesario

// Función para obtener la lista de veterinarios
export const getVeterinarians = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/veterinarians`);
    return response.data; // Retornamos los datos (veterinarios)
  } catch (error) {
    throw error; // Lanzamos el error para que lo maneje quien llame a esta función
  }
};
