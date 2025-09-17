import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const CompleteProfileScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fullname, setFullname] = useState(""); // Nuevo estado para fullname
  const [loading, setLoading] = useState(false);

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

  const updateProfileData = async () => {
    if (!phone || !address || !fullname) {
      // Agregar fullname a la validación
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa todos los campos."
      );
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token missing. Please log in again.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/profile/update`,
        { fullname, phone, address }, // Enviar fullname también
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Datos del perfil actualizados correctamente.");

        // Navegar a CreateFirstPetScreen después de la actualización exitosa
        navigation.navigate("CreateFirstPet");
      } else {
        Alert.alert("Error", "No se pudieron actualizar los datos.");
      }
    } catch (error) {
      console.error("Error actualizando el perfil:", error);
      Alert.alert("Error", "Hubo un error al actualizar los datos.");
    } finally {
      setLoading(false);
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
      formData.append("profileImage", {
        uri: imageUri,
        type: "image/jpeg",
        name: `profile_image_${Date.now()}.jpg`,
      });

      const response = await axios.post(
        `${API_URL}/api/profile/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Imagen de perfil actualizada.");
        setImageUri(response.data.profileImage); // Actualizamos la imagen en el estado
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
      <Text style={styles.title}>Completa tu perfil</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>+</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        value={fullname}
        onChangeText={setFullname} // Actualizar fullname
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={updateProfileData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Actualizando..." : "Actualizar Perfil"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={uploadImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Subiendo..." : "Subir Imagen de Perfil"}
        </Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.registerText}>Volver</Text>
        </TouchableOpacity>
      </View>
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
  registerContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#3bbba4",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});

export default CompleteProfileScreen;
