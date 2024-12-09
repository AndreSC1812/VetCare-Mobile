import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getVeterinarians } from "../api/veterinarians"; // Asegúrate de tener la ruta correcta
import { useFocusEffect } from "@react-navigation/native";

const VeterinarianScreen = () => {
  const [veterinarians, setVeterinarians] = useState([]); // Estado para almacenar los veterinarios
  const [loading, setLoading] = useState(true); // Estado para saber si los datos están cargando
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar el refresco

  // Hacer la solicitud a la API cuando la pantalla se enfoque
  useFocusEffect(
    React.useCallback(() => {
      fetchVeterinarians(); // Llamamos a la función de carga cuando la pantalla se enfoca
    }, [])
  );

  // Función para obtener los veterinarios
  const fetchVeterinarians = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga mientras se hace la solicitud
      const data = await getVeterinarians(); // Obtener los datos de la API
      setVeterinarians(data); // Guardar los datos en el estado
    } catch (error) {
      console.error("Error al obtener los veterinarios:", error);
    } finally {
      setLoading(false); // Cambiar el estado de carga una vez que se reciban los datos
    }
  };

  // Función para manejar el refresco
  const handleRefresh = async () => {
    setRefreshing(true); // Activamos el refresco
    await fetchVeterinarians(); // Volver a obtener los datos
    setRefreshing(false); // Desactivamos el refresco una vez que los datos se hayan cargado
  };

  // Si los datos están cargando, mostramos un indicador de carga
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  // Renderizar cada elemento de la lista de veterinarios
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.fullname}>
          {item.fullname || "Sin nombre completo"}
        </Text>
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={veterinarians} // Lista de veterinarios
        renderItem={renderItem} // Función para renderizar cada veterinario
        keyExtractor={(item) => item._id} // Usamos el ID del veterinario como clave
        refreshing={refreshing} // Indica si está en proceso de refresco
        onRefresh={handleRefresh} // Función que se ejecuta cuando se hace swipe-up
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
  fullname: {
    fontWeight: "bold",
    fontSize: 16,
  },
  username: {
    color: "#555",
  },
});

export default VeterinarianScreen;
