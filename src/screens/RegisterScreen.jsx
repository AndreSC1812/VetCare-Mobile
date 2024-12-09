// RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MySvg from "../../assets/vetcare-logo-verde.svg"; // Asegúrate de que la ruta sea correcta
import Icon from "react-native-vector-icons/MaterialIcons"; // Importa el ícono de Material Icons
import { registerRequest } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage

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
      setError("Por favor, completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
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
        const { token, user } = response.data; // Se espera que el backend devuelva el usuario con su ID
        await AsyncStorage.setItem("token", token); // Guarda el token
        await AsyncStorage.setItem("clientId", user.id.toString()); // Guarda el ID del cliente
        navigation.navigate("CompleteProfile"); // Navegar a la pantalla de completar perfil
      } else {
        setError("Error al registrar, intenta de nuevo");
      }
    } catch (error) {
      // Usar mensaje específico del servidor si está disponible
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Error en la conexión, intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MySvg width={150} height={150} />
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Contraseña"
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
          placeholder="Confirmar Contraseña"
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
          {loading ? "Registrando..." : "Registrarse"}
        </Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text>¿Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.registerText}>Inicia sesión aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7", // Fondo de la pantalla
    alignItems: "center",
    justifyContent: "center", // Centra verticalmente
    paddingHorizontal: 20, // Espaciado horizontal
  },
  title: {
    fontSize: 24,
    marginVertical: 20, // Espaciado vertical
    color: "#3bbba4", // Color del texto
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#3bbba4",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%", // Ancho completo
    backgroundColor: "white", // Fondo blanco para los inputs
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#3bbba4",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "white", // Fondo blanco
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
    width: "100%", // Ancho completo
    justifyContent: "center", // Centra el texto verticalmente
    alignItems: "center", // Centra el texto horizontalmente
    borderRadius: 5, // Esquinas redondeadas
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
    textDecorationLine: "underline", // Subraya el texto
  },
});

export default RegisterScreen;
