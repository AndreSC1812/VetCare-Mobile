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

const CreatePetScreen = ({ navigation }) => {
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petChipNumber, setPetChipNumber] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const createPet = async () => {
    if (!petName || !petSpecies || !petAge || !petChipNumber || !petWeight) {
      Alert.alert(
        "Incomplete fields",
        "Please fill in all the fields."
      );
      return;
    }

    const petAgeInt = parseInt(petAge, 10);
    if (isNaN(petAgeInt) || petAgeInt <= 0) {
      Alert.alert("Invalid age", "Please enter a valid age for the pet.");
      return;
    }

    const petWeightFloat = parseFloat(petWeight);
    if (isNaN(petWeightFloat) || petWeightFloat <= 0) {
      Alert.alert("Invalid weight", "Please enter a valid weight for the pet.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token missing. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/pets`,
        {
          name: petName,
          species: petSpecies,
          age: petAgeInt,
          chipNumber: petChipNumber,
          weight: petWeightFloat,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Pet created successfully.");
        navigation.navigate("UploadPetImage", { petId: response.data.pet._id });
      } else {
        Alert.alert("Error", "Could not create the pet.");
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      Alert.alert("Error", "There was an error creating the pet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Pet</Text>

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
        onPress={createPet}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Save Pet"}
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

export default CreatePetScreen;
