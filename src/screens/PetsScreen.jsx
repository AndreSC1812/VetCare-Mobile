import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getPetsByClient } from "../api/pets"; // Asegúrate de tener la ruta correcta
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import { FAB } from "react-native-paper"; // Importa el componente FAB
import { useNavigation } from "@react-navigation/native";

const PetScreen = () => {
  const navigation = useNavigation(); // Para navegación
  const [pets, setPets] = useState([]); // Estado para almacenar las mascotas
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [refreshing, setRefreshing] = useState(false); // Indicador de refresco

  // Función para obtener las mascotas
  const fetchPets = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga mientras se hace la solicitud
      const clientId = await AsyncStorage.getItem("clientId"); // Obtener el clientId desde AsyncStorage

      if (clientId) {
        const data = await getPetsByClient(clientId); // Obtener los datos de las mascotas
        setPets(data); // Guardar los datos en el estado
      } else {
        console.error("No se encontró el clientId");
      }
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
    } finally {
      setLoading(false); // Cambiar el estado de carga una vez que se reciban los datos
    }
  };

  // Cargar las mascotas al enfocarse en la pantalla
  useEffect(() => {
    fetchPets(); // Llamamos a la función de carga cuando la pantalla se renderiza

    // Agregar listener para cuando la pantalla reciba el foco
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPets(); // Recargar las mascotas cuando la pantalla reciba el foco
    });

    // Limpiar el listener cuando el componente se desmonte
    return unsubscribe;
  }, [navigation]);

  // Función para manejar el refresco
  const handleRefresh = async () => {
    setRefreshing(true); // Activamos el refresco
    await fetchPets(); // Volver a obtener los datos
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

  // Función que maneja el clic en un pet para navegar a la pantalla de detalles
  const handlePetClick = (petId) => {
    navigation.navigate("PetDetail", { petId }); // Navegar a PetDetailScreen pasando el petId
  };

  // Renderizar cada elemento de la lista de mascotas
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePetClick(item._id)}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.image }} style={styles.petImage} />
      <View style={styles.textContainer}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petSpecies}>{item.species}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pets} // Lista de mascotas
        renderItem={renderItem} // Función para renderizar cada mascota
        keyExtractor={(item) => item._id} // Usamos el ID de la mascota como clave
        refreshing={refreshing} // Indica si está en proceso de refresco
        onRefresh={handleRefresh} // Función que se ejecuta cuando se hace swipe-up
      />

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        color="#ffffff"
        onPress={() => navigation.navigate("CreatePetScreen")}
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
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8, // Opcional, para bordes redondeados
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
  petName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  petSpecies: {
    color: "#555",
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#3bbba4", // Puedes personalizar el color aquí
  },
});

export default PetScreen;
