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

const UploadPetImageScreen = ({ route, navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const { petId } = route.params; // Get the created pet's ID

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Gallery access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0]; // Access the first asset
      setImageUri(selectedImage.uri); // Save only the selected image URI
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("No image selected", "Please select an image first");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Token missing. Please log in again.");
        return;
      }

      // Get the file extension
      const fileExtension = imageUri.split(".").pop();

      const formData = new FormData();
      formData.append("petImage", {
        uri: imageUri,
        type: `image/${fileExtension}`, // Set correct MIME type
        name: `pet_image_${Date.now()}.${fileExtension}`, // Name with extension
      });

      const response = await axios.post(
        `${API_URL}/api/pets/${petId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Pet image uploaded.");
        navigation.navigate("HomeTabs");
      } else {
        Alert.alert("Error", "There was an issue uploading the image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        console.error("Server response error:", error.response);
        Alert.alert(
          "Server Error",
          `Code: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        Alert.alert("Network Error", "No response received from server.");
      } else {
        console.error("Unknown error:", error.message);
        Alert.alert("Unknown Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Pet Image</Text>

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
          {loading ? "Uploading..." : "Upload Image"}
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
