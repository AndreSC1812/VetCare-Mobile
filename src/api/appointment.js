// API: appointment.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env"; // Import the API URL from the .env file

// Get appointments for a client
export const getAppointmentsByClient = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    // Make a GET request to the client's appointments route
    const response = await axios.get(`${API_URL}/api/appointments/client`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Return the client's appointments
  } catch (error) {
    console.error("Error fetching client appointments:", error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (idVeterinarian, date) => {
  try {
    // Retrieve the token from local storage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    // Make a POST request to create the appointment
    const response = await axios.post(
      `${API_URL}/api/appointments`,
      {
        idVeterinarian, // Veterinarian ID
        date,           // Appointment date
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization with token
        },
      }
    );

    return response.data; // Return the created appointment
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error; // Throw the error to be handled in the component
  }
};
