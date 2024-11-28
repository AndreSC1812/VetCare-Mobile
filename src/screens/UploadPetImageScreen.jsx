import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const UploadPetImageScreen = ({ route, navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const { petId } = route.params; // Obtén el ID de la mascota creada

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("No image selected", "Please select an image first");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Token missing. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("petImage", {
        uri: imageUri,
        type: "image/jpeg",
        name: `pet_image_${Date.now()}.jpg`,
      });

      const response = await axios.post(
        `http://192.168.0.29:3000/api/pets/${petId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Imagen de la mascota subida.");
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", "Hubo un problema al subir la imagen.");
      }
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      Alert.alert("Error", "Hubo un error al subir la imagen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Imagen de la Mascota</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>+</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={uploadImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Subiendo..." : "Subir Imagen"}
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
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#3bbba4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#E8F9F4",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  placeholderText: {
    fontSize: 48,
    color: "#3bbba4",
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

export default UploadPetImageScreen;
