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
import { API_URL } from "@env";

const EditClientDataScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar datos iniciales del cliente
    const fetchClientData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Usuario no autenticado");

        const response = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const client = response.data.user;
        setFullname(client.fullname || "");
        setUsername(client.username || "");
        setEmail(client.email || "");
        setPhone(client.phone || "");
        setAddress(client.address || "");
      } catch (error) {
        console.error("Error al obtener datos del cliente:", error);
        Alert.alert("Error", "No se pudo cargar los datos del cliente.");
      }
    };

    fetchClientData();
  }, []);

  const updateClientData = async () => {
    if (!fullname || !email) {
      Alert.alert(
        "Campos obligatorios",
        "Por favor, llena los campos requeridos."
      );
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token faltante. Inicia sesión nuevamente.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/profile/update`,
        { fullname, username, email, phone, address },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Datos actualizados exitosamente.");
        navigation.goBack(); // Regresa a la pantalla anterior
      } else {
        Alert.alert("Error", "No se pudieron actualizar los datos.");
      }
    } catch (error) {
      console.error("Error actualizando datos del cliente:", error);
      Alert.alert("Error", "Hubo un error al actualizar los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Datos del Cliente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        value={fullname}
        onChangeText={setFullname}
      />

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
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={updateClientData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Guardando..." : "Guardar Cambios"}
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

export default EditClientDataScreen;
