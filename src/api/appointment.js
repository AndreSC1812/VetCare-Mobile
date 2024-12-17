// API: appointment.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env"; // Importa la URL desde el archivo .env

// Obtener las citas de un cliente
export const getAppointmentsByClient = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación.");
    }

    // Hacemos una solicitud GET a la ruta de citas del cliente
    const response = await axios.get(`${API_URL}/api/appointments/client`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Devuelve las citas del cliente
  } catch (error) {
    console.error("Error al obtener las citas del cliente:", error);
    throw error;
  }
};

// Crear una nueva cita
export const createAppointment = async (idVeterinarian, date) => {
  try {
    // Obtener el token desde el almacenamiento local
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró el token de autenticación.");
    }

    // Hacer la solicitud POST para crear la cita
    const response = await axios.post(
      `${API_URL}/api/appointments`,
      {
        idVeterinarian, // ID del veterinario
        date, // Fecha de la cita
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Autorización con token
        },
      }
    );

    return response.data; // Retorna la cita creada
  } catch (error) {
    console.error("Error al crear la cita:", error);
    throw error; // Lanza el error para ser manejado en el componente
  }
};
