import React, { useState } from "react";
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
import { API_URL } from "@env";

const ChangeProfileImageScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null); // Para guardar la imagen seleccionada
  const [loading, setLoading] = useState(false); // Para gestionar el estado de carga

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
      const selectedImage = result.assets[0]; // Accedemos al primer asset
      setImageUri(selectedImage.uri); // Guardamos la URI de la imagen seleccionada
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("No image selected", "Please select an image first");
      return;
    }

    setLoading(true); // Establecemos el estado de carga a true

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Token missing. Please log in again.");
        return;
      }

      // Aquí obtenemos el tipo MIME del archivo
      const fileExtension = imageUri.split(".").pop(); // Obtener la extensión del archivo

      const formData = new FormData();
      formData.append("profileImage", {
        uri: imageUri,
        type: `image/${fileExtension}`, // Asignar el tipo correcto según la extensión
        name: `profile_image_${Date.now()}.${fileExtension}`, // Ajustar el nombre del archivo con la extensión
      });

      const response = await axios.post(
        `${API_URL}/api/profile/upload`, // URL del backend para subir la imagen
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Imagen de perfil subida correctamente.");
        navigation.goBack(); // Volver a la pantalla anterior (perfil)
      } else {
        Alert.alert("Error", "Hubo un problema al subir la imagen.");
      }
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      Alert.alert("Error", "Hubo un problema con la carga de la imagen.");
    } finally {
      setLoading(false); // Desactivamos el estado de carga al final
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Imagen de Perfil</Text>

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

export default ChangeProfileImageScreen;
