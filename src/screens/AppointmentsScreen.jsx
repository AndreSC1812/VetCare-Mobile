import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getAppointmentsByClient } from "../api/appointment";
import { useFocusEffect } from "@react-navigation/native";

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]); // Store appointments
  const [loading, setLoading] = useState(true); // Loading indicator
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh indicator

  // Fetch appointments when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentsByClient(); // API call to fetch appointments
      setAppointments(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("No appointments found for this client.");
        setAppointments([]);
      } else {
        console.error("Error fetching appointments:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  // Get color based on appointment status
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmada":
        return "#3bbba4"; // Green
      case "Cancelada":
        return "#F44336"; // Red
      case "Pendiente":
        return "#9E9E9E"; // Grey
      default:
        return "#000"; // Default black
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.date}>
          Date:{" "}
          {new Date(item.date).toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </Text>
        <Text style={styles.vetName}>Veterinarian: {item.veterinarianFullname}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          Status: {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {appointments.length === 0 ? (
        <Text>No appointments scheduled.</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: { flexDirection: "column" },
  date: { fontSize: 16, color: "#333", marginBottom: 5 },
  vetName: { fontSize: 16, color: "#333" },
  status: { fontSize: 16, marginTop: 5 },
});

export default AppointmentsScreen;
