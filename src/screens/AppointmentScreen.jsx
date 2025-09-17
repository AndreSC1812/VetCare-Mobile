import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createAppointment } from "../api/appointment";

const AppointmentScreen = ({ route, navigation }) => {
  const { veterinarianId, startTime, endTime } = route.params; // Get veterinarian working hours from route params
  const [selectedDate, setSelectedDate] = useState(null); // null means no date selected yet
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date"); // "date" or "time"

  // Handle change in DateTimePicker
  const onChange = (event, date) => {
    if (date) {
      if (mode === "date") {
        setMode("time"); // switch to time picker after selecting date
        setShowPicker(true);
        setSelectedDate((prev) => {
          const updated = new Date(prev);
          updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
          return updated;
        });
      } else {
        setShowPicker(false); // close picker after selecting time
        setSelectedDate((prev) => {
          const updated = new Date(prev);
          updated.setHours(date.getHours(), date.getMinutes());
          return updated;
        });
      }
    } else {
      setShowPicker(false); // close picker if canceled
    }
  };

  // Show the date/time picker
  const showDateTimePicker = () => {
    setMode("date");
    setShowPicker(true);
  };

  // Check if the selected time is within veterinarian working hours
  const isWithinWorkingHours = (date) => {
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    const selectedMinutes = date.getHours() * 60 + date.getMinutes();
    const startMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMinute);

    return selectedMinutes >= startMinutes && selectedMinutes <= endMinutes;
  };

  // Confirm appointment
  const handleConfirmAppointment = async () => {
    if (!selectedDate) {
      Alert.alert("Selection required", "Please select a date and time before confirming.");
      return;
    }

    if (!isWithinWorkingHours(selectedDate)) {
      Alert.alert("Invalid time", "Selected time is outside the veterinarian's working hours.");
      return;
    }

    try {
      await createAppointment(veterinarianId, selectedDate);
      Alert.alert(
        "Appointment Requested",
        `Your appointment has been requested for ${formatDate(selectedDate)}`
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to create appointment.");
    }
  };

  // Format date/time for display
  const formatDate = (date) =>
    date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a date and time for your appointment:</Text>
      <Text style={styles.workingHours}>
        Veterinarian Hours: {startTime} - {endTime}
      </Text>

      <Text style={styles.selectedDate}>
        {selectedDate
          ? `Selected date and time: ${formatDate(selectedDate)}`
          : "No date and time selected yet"}
      </Text>

      <TouchableOpacity style={styles.button} onPress={showDateTimePicker}>
        <Text style={styles.buttonText}>Select Date & Time</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode={mode}
          display="spinner"
          onChange={onChange}
          minimumDate={new Date()} // prevent past dates
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleConfirmAppointment}>
        <Text style={styles.buttonText}>Confirm Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
  workingHours: { fontSize: 16, marginBottom: 10, color: "#555", fontStyle: "italic" },
  title: { fontSize: 20, marginBottom: 20, fontWeight: "bold" },
  selectedDate: { fontSize: 16, marginVertical: 20, color: "#333" },
  button: {
    backgroundColor: "#3bbba4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    width: "80%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default AppointmentScreen;
