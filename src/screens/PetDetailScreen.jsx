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
import { getPetById } from "../api/pets"; // Make sure getPetById exists
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const PetDetailScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const data = await getPetById(petId);
      setPet(data);
    } catch (error) {
      console.error("Error fetching pet details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetDetails();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPetDetails();
    });
    return unsubscribe;
  }, [navigation, petId]);

  const handleDeletePet = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this pet?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Error", "You are not authenticated. Please log in.");
              return;
            }
            try {
              await axios.delete(`${API_URL}/api/pets/${petId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert("Success", "The pet has been deleted.");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting pet:", error);
              Alert.alert("Error", "There was a problem deleting the pet.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Unable to load pet details
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pet.image }} style={styles.petImage} />
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petSpecies}>{pet.species}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Age:</Text>
        <Text style={styles.infoText}>{pet.age} years</Text>

        <Text style={styles.infoTitle}>Chip Number:</Text>
        <Text style={styles.infoText}>{pet.chipNumber}</Text>

        <Text style={styles.infoTitle}>Weight:</Text>
        <Text style={styles.infoText}>{pet.weight} kg</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("UploadPetImage", { petId })}
        >
          <Text style={styles.buttonText}>Change Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("UpdatePet", { petId })}
        >
          <Text style={styles.buttonText}>Edit Details</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => navigation.navigate("PetReportsScreen", { petId })}
      >
        <Text style={styles.buttonText}>View Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePet}>
        <Text style={styles.buttonText}>Delete Pet</Text>
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
    marginTop: 40,
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
  reportButton: {
    backgroundColor: "#3bbba4",
    marginTop: 20,
    borderRadius: 8,
    width: "97%",
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    marginTop: 20,
    borderRadius: 8,
    width: "97%",
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PetDetailScreen;
