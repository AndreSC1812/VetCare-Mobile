import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MySvg from "../../assets/vetcare-logo-verde.svg"; // Asegúrate de que la ruta sea correcta

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "" || password === "") {
      setError("Por favor, completa todos los campos");
    } else {
      setError("");
      console.log("Iniciar sesión con", email, password);
      navigation.navigate("Register"); // Navega a la pantalla de registro (o a la que desees)
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
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
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

export default LoginScreen;
