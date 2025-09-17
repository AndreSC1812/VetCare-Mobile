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
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Access to the gallery is needed.");
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

  // Update profile data (fullname, phone, address)
  const updateProfileData = async () => {
    if (!phone || !address || !fullname) {
      Alert.alert("Incomplete fields", "Please complete all fields.");
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
        { fullname, phone, address },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully.");
        navigation.navigate("CreateFirstPet"); // Navigate to first pet screen
      } else {
        Alert.alert("Error", "Failed to update profile data.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "There was an error updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  // Upload profile image
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
        Alert.alert("Success", "Profile image uploaded successfully.");
        setImageUri(response.data.profileImage); // Update image state
      } else {
        Alert.alert("Error", "There was a problem uploading the image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "There was an error uploading the image.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>+</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullname}
        onChangeText={setFullname}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={updateProfileData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={uploadImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Uploading..." : "Upload Profile Image"}
        </Text>
      </TouchableOpacity>

      <View style={styles.backContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
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
  backContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  backText: {
    color: "#3bbba4",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});

export default CompleteProfileScreen;
