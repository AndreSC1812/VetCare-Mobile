import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getPetById, deletePet } from "../api/pets"; // Asegúrate de tener la función deletePet para eliminar una mascota
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const PetDetailScreen = ({ route, navigation }) => {
  const { petId } = route.params; // Obtenemos el petId desde los parámetros de la ruta
  const [pet, setPet] = useState(null); // Estado para los detalles de la mascota
  const [loading, setLoading] = useState(true); // Indicador de carga

  // Función para obtener los detalles de la mascota
  const fetchPetDetails = async () => {
    try {
      setLoading(true); // Activamos el indicador de carga
      const data = await getPetById(petId); // Llamamos a la API con el petId
      setPet(data); // Guardamos los datos de la mascota
    } catch (error) {
      console.error("Error al obtener los detalles de la mascota:", error);
    } finally {
      setLoading(false); // Terminamos el estado de carga
    }
  };

  // Usamos el hook useEffect para cargar los datos al montar la pantalla
  useEffect(() => {
    console.log("Pet ID:", petId);
    fetchPetDetails(); // Llamamos a la función cuando el componente se monta

    // Agregar listener para cuando la pantalla reciba el foco
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPetDetails(); // Recargar los detalles de la mascota cuando la pantalla reciba el foco
    });

    // Limpiar el listener cuando el componente se desmonte
    return unsubscribe;
  }, [navigation, petId]);

  // Función para eliminar la mascota
  const handleDeletePet = async () => {
    try {
      // Usamos Alert.alert para crear una confirmación personalizada
      Alert.alert(
        "Confirmar eliminación",
        "¿Estás seguro de que deseas eliminar esta mascota?",
        [
          {
            text: "Cancelar", // Acción para cancelar
            onPress: () => console.log("Cancelado"),
            style: "cancel",
          },
          {
            text: "Eliminar", // Acción para eliminar
            onPress: async () => {
              // Si el usuario confirma, procedemos a eliminar la mascota
              const token = await AsyncStorage.getItem("token"); // Obtener el token de autenticación
              if (!token) {
                Alert.alert("Error", "No estás autenticado. Inicia sesión.");
                return;
              }

              try {
                // Llamada a la API para eliminar la mascota
                await axios.delete(`${API_URL}/api/pets/${petId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                Alert.alert("Éxito", "La mascota ha sido eliminada.");
                navigation.goBack(); // Volver a la pantalla anterior
              } catch (error) {
                console.error("Error al eliminar la mascota:", error);
                Alert.alert(
                  "Error",
                  "Hubo un problema al eliminar la mascota."
                );
              }
            },
          },
        ],
        { cancelable: false } // Deshabilitar el toque fuera para cerrar la alerta
      );
    } catch (error) {
      console.error("Error al intentar eliminar la mascota:", error);
      Alert.alert("Error", "Hubo un problema al intentar eliminar la mascota.");
    }
  };

  // Si los detalles de la mascota están cargando, mostramos un indicador de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  // Si no se encontraron los detalles de la mascota, mostramos un mensaje de error
  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se pudo cargar los detalles de la mascota
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen de la mascota */}
      <Image source={{ uri: pet.image }} style={styles.petImage} />

      {/* Nombre de la mascota */}
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petSpecies}>{pet.species}</Text>

      {/* Datos adicionales */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Edad:</Text>
        <Text style={styles.infoText}>{pet.age} años</Text>

        <Text style={styles.infoTitle}>Número de Chip:</Text>
        <Text style={styles.infoText}>{pet.chipNumber}</Text>

        <Text style={styles.infoTitle}>Peso:</Text>
        <Text style={styles.infoText}>{pet.weight} kg</Text>
      </View>

      {/* Botones para cambiar foto y cambiar datos */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("UploadPetImage", { petId })} // Pasar el petId
        >
          <Text style={styles.buttonText}>Cambiar Foto</Text>
        </TouchableOpacity>

        {/* Navegar a la pantalla de edición de datos */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("UpdatePet", { petId })}
        >
          <Text style={styles.buttonText}>Cambiar Datos</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para ver informes, con el mismo estilo que el botón de eliminar */}
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => navigation.navigate("PetReportsScreen", { petId })} // Aquí se navega pasando el petId
      >
        <Text style={styles.buttonText}>Ver Informes</Text>
      </TouchableOpacity>

      {/* Botón para eliminar la mascota, colocado debajo de "Ver Informes" */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePet}>
        <Text style={styles.buttonText}>Eliminar Mascota</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    marginTop: 40, // Añadido margen superior para dar espacio
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  petSpecies: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#3bbba4",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  reportButton: {
    backgroundColor: "#3bbba4", // Color igual a los otros botones
    marginTop: 20, // Añadir espacio entre los botones
    borderRadius: 8,
    width: "97%", // Aseguramos que ocupe todo el ancho
    alignItems: "center",
    paddingVertical: 10, // Un poco más de espacio en el botón
  },
  deleteButton: {
    backgroundColor: "#ff4d4d", // Color rojo para el botón de eliminar
    marginTop: 20, // Añadir espacio entre botones
    borderRadius: 8,
    width: "97%", // Aseguramos que ocupe todo el ancho
    alignItems: "center",
    paddingVertical: 10, // Un poco más de espacio en el botón
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PetDetailScreen;
