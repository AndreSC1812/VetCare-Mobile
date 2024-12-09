import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MySvg from "../../assets/vetcare-logo-verde.svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import { loginRequest } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const credentials = { email, password, userType: "client" };
      const response = await loginRequest(credentials);

      if (response.status === 200) {
        const { token, user } = response.data; // El backend devuelve el usuario con el id y el token
        await AsyncStorage.setItem("token", token); // Guardar el token
        await AsyncStorage.setItem("clientId", user.id.toString()); // Guardar el ID del cliente
        navigation.navigate("HomeTabs"); // Navegar a la pantalla principal
      } else {
        setError("Error al iniciar sesión, intenta de nuevo");
      }
    } catch (error) {
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
      <Text style={styles.title}>Iniciar Sesión</Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text>¿No tienes cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Regístrate aquí</Text>
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#3bbba4",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "white",
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

export default LoginScreen;
