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
import { getVeterinarians } from "../api/veterinarians"; // Make sure the path is correct
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const VeterinarianScreen = () => {
  const navigation = useNavigation(); // For navigation
  const [veterinarians, setVeterinarians] = useState([]); // State to store veterinarians
  const [loading, setLoading] = useState(true); // Loading indicator
  const [refreshing, setRefreshing] = useState(false); // Refresh indicator

  // Fetch veterinarians when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchVeterinarians();
    }, [])
  );

  // Function to fetch veterinarians
  const fetchVeterinarians = async () => {
    try {
      setLoading(true); // Show loading indicator
      const data = await getVeterinarians(); // Fetch data from API
      setVeterinarians(data); // Save data in state
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVeterinarians();
    setRefreshing(false);
  };

  // Show loading indicator if data is loading
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  // Handle veterinarian item click to navigate to detail screen
  const handleVetClick = (vetId) => {
    navigation.navigate("VeterinarianDetail", { vetId });
  };

  // Render each veterinarian in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleVetClick(item._id)}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.fullname}>
          {item.fullname || "No full name"}
        </Text>
        <Text style={styles.specialization}>
          {item.specialization || "No specialization"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={veterinarians}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
    borderRadius: 8, // Optional: rounded corners
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
  specialization: {
    color: "#555",
  },
});

export default VeterinarianScreen;
