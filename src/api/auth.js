// api/auth.js
import axios from "axios";

const API_URL = "http://192.168.0.29:3000"; // Cambia por la URL real de la API en produccion si es necesario

// Solicitud de registro
export const registerRequest = (client) => {
  return axios.post(`${API_URL}/api/auth/register`, client);
};

// Solicitud de login
export const loginRequest = (client) => {
  return axios.post(`${API_URL}/api/auth/login`, client);
};

// Obtener perfil del cliente
export const getProfile = (token) => {
  return axios.get(`${API_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
    },
  });
};
