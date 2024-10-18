import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MySvg from "../../assets/vetcare-logo-verde.svg"; // Asegúrate de que la ruta sea correcta

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos");
    } else if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      setError("");
      console.log("Registrando usuario:", username, email);
      navigation.navigate("Login"); // Navega al login después del registro
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
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text>¿Ya tienes cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Inicia sesión aquí</Text>
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
  loginContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#3bbba4",
    marginLeft: 5,
    textDecorationLine: "underline", // Subraya el texto
  },
});

export default RegisterScreen;
