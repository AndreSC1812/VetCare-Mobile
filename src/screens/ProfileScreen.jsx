import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getProfile } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation(); // Para navegación
  const [profile, setProfile] = useState(null); // Estado para el perfil
  const [loading, setLoading] = useState(true); // Indicador de carga

  // Función para obtener el perfil del usuario
  const fetchProfile = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga mientras se hace la solicitud
      const token = await AsyncStorage.getItem("token"); // Obtener el token del almacenamiento local
      if (!token) throw new Error("Usuario no autenticado");

      const { data } = await getProfile(token); // Hacer solicitud al backend
      setProfile(data.user); // Guardar los datos del perfil en el estado
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    } finally {
      setLoading(false); // Detener el indicador de carga
    }
  };

  // Cargar el perfil al montar y cuando la pantalla reciba el foco
  useEffect(() => {
    fetchProfile(); // Cargar el perfil inicialmente

    // Agregar un listener para cuando la pantalla reciba el foco
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProfile(); // Recargar el perfil al recibir el foco
    });

    // Limpiar el listener cuando el componente se desmonte
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen de perfil */}
      <Image
        source={{ uri: profile.profileImage }}
        style={styles.profileImage}
      />

      {/* Nombre y username */}
      <Text style={styles.fullname}>
        {profile.fullname || "Nombre desconocido"}
      </Text>
      <Text style={styles.username}>{`@${profile.username}`}</Text>

      {/* Datos personales */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Correo Electrónico</Text>
        <Text style={styles.infoText}>{profile.email}</Text>

        <Text style={styles.infoTitle}>Teléfono</Text>
        <Text style={styles.infoText}>
          {profile.phone || "No proporcionado"}
        </Text>

        <Text style={styles.infoTitle}>Dirección</Text>
        <Text style={styles.infoText}>
          {profile.address || "No proporcionada"}
        </Text>
      </View>

      {/* Botones para cambiar perfil y datos */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ChangeProfileImageScreen")} // Aquí estamos navegando a la pantalla de cambiar foto
        >
          <Text style={styles.buttonText}>Cambiar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EditClientData")}
        >
          <Text style={styles.buttonText}>Cambiar Datos</Text>
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
  },
  fullname: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
