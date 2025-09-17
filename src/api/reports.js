import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage para acceder al almacenamiento local
import { API_URL } from "@env";

// Obtener los informes de una mascota
export const getReportsByPet = async (petId) => {
  try {
    const token = await AsyncStorage.getItem("token"); // Obtener el token almacenado

    if (!token) {
      throw new Error("No se encontró el token de autenticación.");
    }

    return axios.get(`${API_URL}/api/reports/pet/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pasar el token en los encabezados
      },
    });
  } catch (error) {
    console.error("Error al obtener los informes de la mascota:", error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};

// Obtener un informe por ID
export const getReportById = async (reportId) => {
  try {
    const token = await AsyncStorage.getItem("token"); // Obtener el token almacenado

    if (!token) {
      throw new Error("No se encontró el token de autenticación.");
    }

    return axios.get(`${API_URL}/api/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pasar el token en los encabezados
      },
    });
  } catch (error) {
    console.error("Error al obtener el informe por ID:", error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};

// Función para actualizar un informe
export const updateReportRequest = async (reportId, updatedReportData) => {
  const token = localStorage.getItem("token"); // Obtener token

  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const response = await axios.put(
      `${API}/api/reports/${reportId}`, // La ruta para actualizar el informe
      updatedReportData, // Los datos del informe actualizados
      {
        headers: {
          Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
        },
      }
    );

    return response.data.report; // Devuelve el informe actualizado
  } catch (error) {
    console.error("Error updating report:", error);
    throw new Error("No se pudo actualizar el informe.");
  }
};
