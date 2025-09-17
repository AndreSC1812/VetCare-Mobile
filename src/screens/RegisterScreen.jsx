// RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MySvg from "../../assets/vetcare-logo-verde.svg"; // Make sure the path is correct
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons
import { registerRequest } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const client = {
        username,
        email,
        password,
        userType: "client",
      };

      const response = await registerRequest(client);

      if (response.status === 201) {
        const { token, user } = response.data; // Expect backend to return user with ID
        await AsyncStorage.setItem("token", token); // Save token
        await AsyncStorage.setItem("clientId", user.id.toString()); // Save client ID
        navigation.navigate("CompleteProfile"); // Navigate to complete profile screen
      } else {
        setError("Registration failed, please try again");
      }
    } catch (error) {
      // Use server-specific message if available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Connection error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MySvg width={150} height={150} />
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#3bbba4"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon
            name={showConfirmPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#3bbba4"
          />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.registerText}>Login here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7", // Screen background
    alignItems: "center",
    justifyContent: "center", // Center vertically
    paddingHorizontal: 20, // Horizontal spacing
  },
  title: {
    fontSize: 24,
    marginVertical: 20, // Vertical spacing
    color: "#3bbba4", // Text color
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#3bbba4",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%", // Full width
    backgroundColor: "white", // White background for inputs
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#3bbba4",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "white", // White background
  },
  inputPassword: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  toggleButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3bbba4",
    height: 40,
    width: "100%", // Full width
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    borderRadius: 5, // Rounded corners
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
    textDecorationLine: "underline", // Underline text
  },
});

export default RegisterScreen;
