import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getAppointmentsByClient } from "../api/appointment"; // Asegúrate de tener la ruta correcta
import { useFocusEffect } from "@react-navigation/native"; // Para la actualización al enfocar la pantalla

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]); // Estado para almacenar las citas
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [refreshing, setRefreshing] = useState(false); // Indicador de refresco

  // Hacer la solicitud a la API cuando la pantalla se enfoque
  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments(); // Llamamos a la función de carga cuando la pantalla se enfoca
    }, [])
  );

  // Función para obtener las citas
  const fetchAppointments = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga mientras se hace la solicitud
      const data = await getAppointmentsByClient(); // Obtener los datos de las citas
      setAppointments(data); // Guardar los datos en el estado
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si el error es un 404, mostramos un mensaje adecuado
        console.warn("No se encontraron citas para este cliente.");
        setAppointments([]); // Aseguramos que las citas estén vacías
      } else {
        console.error("Error al obtener las citas:", error); // Otros errores
      }
    } finally {
      setLoading(false); // Cambiar el estado de carga una vez que se reciban los datos
    }
  };

  // Función para manejar el refresco
  const handleRefresh = async () => {
    setRefreshing(true); // Activamos el refresco
    await fetchAppointments(); // Volver a obtener los datos
    setRefreshing(false); // Desactivamos el refresco una vez que los datos se hayan cargado
  };

  // Si los datos están cargando, mostramos un indicador de carga
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  // Función para obtener el color según el estado de la cita
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmada":
        return "#3bbba4"; // Verde
      case "Cancelada":
        return "#F44336"; // Rojo
      case "Pendiente":
        return "#9E9E9E"; // Gris
      default:
        return "#000"; // Negro por defecto
    }
  };

  // Renderizar cada cita en la lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.date}>
          Fecha:{" "}
          {new Date(item.date).toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </Text>

        <Text style={styles.vetName}>
          Veterinario: {item.veterinarianFullname}
        </Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          Estado: {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {appointments.length === 0 ? (
        <Text>No tienes citas programadas.</Text> // Este mensaje se muestra si no hay citas
      ) : (
        <FlatList
          data={appointments} // Lista de citas
          renderItem={renderItem} // Función para renderizar cada cita
          keyExtractor={(item) => item._id} // Usamos el ID de cada cita como clave
          refreshing={refreshing} // Indica si está en proceso de refresco
          onRefresh={handleRefresh} // Función que se ejecuta cuando se hace swipe-up
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flexDirection: "column",
  },
  date: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  vetName: {
    fontSize: 16,
    color: "#333",
  },
  status: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default AppointmentsScreen;
