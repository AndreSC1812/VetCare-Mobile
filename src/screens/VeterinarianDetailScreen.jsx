import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { getVeterinarianById } from "../api/veterinarians";

const VeterinarianDetailScreen = ({ route, navigation }) => {
  const { vetId } = route.params;
  const [veterinarian, setVeterinarian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVeterinarian = async () => {
      try {
        const data = await getVeterinarianById(vetId);
        setVeterinarian(data);
      } catch (error) {
        console.error("Error al obtener los detalles del veterinario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarian();
  }, [vetId]);

  // Función para llamar al veterinario
  const handleCall = () => {
    if (!veterinarian.phone) {
      Alert.alert("Error", "No hay un número de teléfono disponible.");
      return;
    }
    const phoneNumber = `tel:${veterinarian.phone}`;
    Linking.openURL(phoneNumber).catch(() =>
      Alert.alert("Error", "No se pudo abrir la aplicación de llamadas.")
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  if (!veterinarian) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se encontraron detalles para este veterinario.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: veterinarian.profileImage }}
        style={styles.profileImage}
      />
      <Text style={styles.fullname}>{veterinarian.fullname}</Text>
      <Text style={styles.specialization}>
        Especialización: {veterinarian.specialization || "No especificada"}
      </Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Años de experiencia:</Text>
        <Text style={styles.infoText}>
          {veterinarian.yearsOfExperience || "N/A"}
        </Text>

        <Text style={styles.infoTitle}>Email:</Text>
        <Text style={styles.infoText}>{veterinarian.email}</Text>

        <Text style={styles.infoTitle}>Teléfono:</Text>
        <Text style={styles.infoText}>{veterinarian.phone}</Text>

        <Text style={styles.infoTitle}>Dirección de la clínica:</Text>
        <Text style={styles.infoText}>
          {veterinarian.clinicAddress || "No especificada"}
        </Text>
        {/* Mostrar el horario de atención */}
        <Text style={styles.infoTitle}>
          Horario de Atención (Lunes a Viernes):
        </Text>
        <Text style={styles.infoText}>
          {veterinarian.startTime && veterinarian.endTime
            ? `${veterinarian.startTime} - ${veterinarian.endTime}`
            : "No especificado"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* Botón para pedir cita */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Appointment", {
              veterinarianId: veterinarian._id,
              startTime: veterinarian.startTime,
              endTime: veterinarian.endTime,
            })
          }
        >
          <Text style={styles.buttonText}>Pedir Cita</Text>
        </TouchableOpacity>
        {/* Botón para llamar */}
        <TouchableOpacity style={styles.buttonCall} onPress={handleCall}>
          <Text style={styles.buttonText}>Llamar</Text>
        </TouchableOpacity>
      </View>
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
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    marginTop: 40,
  },
  fullname: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  specialization: {
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
    elevation: 3,
    shadowColor: "#000",
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
  buttonCall: {
    flex: 1,
    backgroundColor: "#3bbba4",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VeterinarianDetailScreen;
