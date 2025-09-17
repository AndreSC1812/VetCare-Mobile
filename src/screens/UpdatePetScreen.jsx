
import React, { useState, useEffect } from "react";
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
import { getPetById } from "../api/pets";
import { API_URL } from "@env";

const UpdatePetScreen = ({ route, navigation }) => {
  const { petId } = route.params; // Get petId from route parameters
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petChipNumber, setPetChipNumber] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [loading, setLoading] = useState(false);

  // Load pet details
  const loadPetData = async () => {
    try {
      setLoading(true);
      const pet = await getPetById(petId); // Fetch pet details using petId
      setPetName(pet.name);
      setPetSpecies(pet.species);
      setPetAge(pet.age.toString()); // Convert age to string
      setPetChipNumber(pet.chipNumber);
      setPetWeight(pet.weight.toString()); // Convert weight to string
    } catch (error) {
      console.error("Error loading pet details:", error);
      Alert.alert("Error", "Unable to load pet details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPetData(); // Call function on component mount
  }, [petId]);

  // Update pet data
  const updatePetData = async () => {
    // Validate all fields are filled
    if (!petName || !petSpecies || !petAge || !petChipNumber || !petWeight) {
      Alert.alert("Incomplete Fields", "Please fill out all fields.");
      return;
    }

    // Validate age
    const petAgeInt = parseInt(petAge, 10);
    if (isNaN(petAgeInt) || petAgeInt <= 0) {
      Alert.alert("Invalid Age", "Please enter a valid age for the pet.");
      return;
    }

    // Validate weight
    const petWeightInt = parseFloat(petWeight);
    if (isNaN(petWeightInt) || petWeightInt <= 0) {
      Alert.alert("Invalid Weight", "Please enter a valid weight for the pet.");
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
        `${API_URL}/api/pets/${petId}`, // Endpoint to update pet
        {
          name: petName,
          species: petSpecies,
          age: petAgeInt,
          chipNumber: petChipNumber,
          weight: petWeightInt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Pet data updated successfully.");
        navigation.goBack(); // Go back to previous screen
      } else {
        Alert.alert("Error", "Unable to update pet data.");
      }
    } catch (error) {
      console.error("Error updating pet data:", error);
      Alert.alert("Error", "There was an error updating the pet data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Pet Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        value={petName}
        onChangeText={setPetName}
      />

      <TextInput
        style={styles.input}
        placeholder="Pet Species"
        value={petSpecies}
        onChangeText={setPetSpecies}
      />

      <TextInput
        style={styles.input}
        placeholder="Pet Age"
        value={petAge}
        onChangeText={setPetAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Chip Number"
        value={petChipNumber}
        onChangeText={setPetChipNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Pet Weight (kg)"
        value={petWeight}
        onChangeText={setPetWeight}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={updatePetData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update Pet"}
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

export default UpdatePetScreen;
