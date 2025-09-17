import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const CreateFirstPetScreen = ({ navigation }) => {
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petChipNumber, setPetChipNumber] = useState(""); // Nuevo estado para chipNumber
  const [petWeight, setPetWeight] = useState(""); // Nuevo estado para weight
  const [loading, setLoading] = useState(false);

  // Función para crear la mascota
  const createPet = async () => {
    // Validación para asegurarse de que todos los campos estén completos
    if (!petName || !petSpecies || !petAge || !petChipNumber || !petWeight) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa todos los campos."
      );
      return;
    }

    // Validación para asegurarse de que la edad es un número válido
    const petAgeInt = parseInt(petAge, 10);
    if (isNaN(petAgeInt) || petAgeInt <= 0) {
      Alert.alert(
        "Edad inválida",
        "Por favor, ingresa una edad válida para la mascota."
      );
      return;
    }

    // Validación para asegurarse de que el peso es un número válido
    const petWeightInt = parseFloat(petWeight);
    if (isNaN(petWeightInt) || petWeightInt <= 0) {
      Alert.alert(
        "Peso inválido",
        "Por favor, ingresa un peso válido para la mascota."
      );
      return;
    }

    setLoading(true);
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token missing. Please log in again.");
        return;
      }

      // Enviar la solicitud para crear la mascota
      const response = await axios.post(
        `${API_URL}/api/pets`, // Endpoint para crear la mascota
        {
          name: petName,
          species: petSpecies,
          age: petAgeInt, // Enviar petAge como número
          chipNumber: petChipNumber, // Enviar chipNumber
          weight: petWeightInt, // Enviar weight
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Verificar si la solicitud fue exitosa
      if (response.status === 201) {
        Alert.alert("Éxito", "Mascota creada exitosamente.");
        // Navegar a la siguiente pantalla donde se elegirá la imagen de la mascota
        navigation.navigate("UploadPetImage", { petId: response.data.pet._id });
      } else {
        Alert.alert("Error", "No se pudo crear la mascota.");
      }
    } catch (error) {
      console.error("Error creando la mascota:", error);
      Alert.alert("Error", "Hubo un error al crear la mascota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añade Primera Mascota</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la Mascota"
        value={petName}
        onChangeText={setPetName}
      />

      <TextInput
        style={styles.input}
        placeholder="Especie de la Mascota"
        value={petSpecies}
        onChangeText={setPetSpecies}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad de la Mascota"
        value={petAge}
        onChangeText={setPetAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Chip"
        value={petChipNumber}
        onChangeText={setPetChipNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Peso de la Mascota (kg)"
        value={petWeight}
        onChangeText={setPetWeight}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={createPet}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creando..." : "Crear Mascota"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
    color: "#3bbba4",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#3bbba4",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#3bbba4",
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CreateFirstPetScreen;
