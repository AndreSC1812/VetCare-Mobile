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
import { getPetsByClient } from "../api/pets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const PetScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const clientId = await AsyncStorage.getItem("clientId");

      if (clientId) {
        const data = await getPetsByClient(clientId);
        setPets(data);
      } else {
        console.error("Client ID not found");
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchPets();
    });

    return unsubscribe;
  }, [navigation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPets();
    setRefreshing(false);
  };

  const handlePetClick = (petId) => {
    navigation.navigate("PetDetail", { petId });
  };

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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No pets found.
          </Text>
        }
      />

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
    borderRadius: 8,
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
    backgroundColor: "#3bbba4",
  },
});

export default PetScreen;
