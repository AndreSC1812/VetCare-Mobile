import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createAppointment } from "../api/appointment";

const AppointmentScreen = ({ route, navigation }) => {
  const { veterinarianId, startTime, endTime } = route.params; // Recibimos el horario de atención
  const [selectedDate, setSelectedDate] = useState(null); // Usamos null para indicar que aún no se ha seleccionado una fecha
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date"); // Puede ser 'date' o 'time'

  // Función para manejar el cambio de fecha/hora
  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      if (mode === "date") {
        // Cambiamos al modo de hora tras seleccionar la fecha
        setMode("time");
        setShowPicker(true);
        setSelectedDate((prevDate) => {
          const updatedDate = new Date(prevDate);
          updatedDate.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          );
          return updatedDate;
        });
      } else {
        // Cerramos el picker tras seleccionar la hora
        setShowPicker(false);
        setSelectedDate((prevDate) => {
          const updatedDate = new Date(prevDate);
          updatedDate.setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes()
          );
          return updatedDate;
        });
      }
    } else {
      setShowPicker(false); // Cerramos si no se selecciona nada
    }
  };

  // Función para mostrar el picker
  const showDateTimePicker = () => {
    setMode("date");
    setShowPicker(true);
  };

  // Función para verificar si la hora seleccionada está dentro del horario del veterinario
  const isWithinWorkingHours = (date) => {
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    // Extraemos solo la hora y minuto de la fecha seleccionada
    const selectedHour = date.getHours();
    const selectedMinute = date.getMinutes();

    // Convertimos las horas de inicio y fin a minutos para facilitar la comparación
    const startMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
    const selectedMinutes = selectedHour * 60 + selectedMinute;

    // Verificamos si la hora seleccionada está dentro del rango
    return selectedMinutes >= startMinutes && selectedMinutes <= endMinutes;
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDate) {
      Alert.alert(
        "Selección requerida",
        "Por favor, selecciona una fecha y hora antes de confirmar la cita."
      );
      return;
    }

    if (!isWithinWorkingHours(selectedDate)) {
      Alert.alert(
        "Hora inválida",
        "La hora seleccionada no está dentro del horario de atención del veterinario."
      );
      return;
    }

    try {
      const appointment = await createAppointment(veterinarianId, selectedDate);
      Alert.alert(
        "Solicitud de cita creada",
        `Tu cita ha sido solicitada para el ${formatDate(selectedDate)}`
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la cita.");
    }
  };

  // Función para formatear la fecha
  const formatDate = (date) => {
    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona fecha y hora para tu cita:</Text>

      {/* Mostrar horario del veterinario */}
      <Text style={styles.workingHours}>
        Horario del Veterinario: {startTime} - {endTime}
      </Text>

      {/* Mostrar la fecha seleccionada solo si existe */}
      <Text style={styles.selectedDate}>
        {selectedDate
          ? `Fecha y hora seleccionada: ${formatDate(selectedDate)}`
          : "Selecciona una fecha y hora"}
      </Text>

      <TouchableOpacity style={styles.button} onPress={showDateTimePicker}>
        <Text style={styles.buttonText}>Seleccionar fecha y hora</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()} // Si no hay fecha seleccionada, mostramos la fecha actual
          mode={mode}
          display="spinner" // Usamos el spinner como estilo
          onChange={onChange}
          minimumDate={new Date()} // Evita seleccionar fechas pasadas
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleConfirmAppointment}
      >
        <Text style={styles.buttonText}>Confirmar Cita</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  workingHours: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
    fontStyle: "italic",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  selectedDate: {
    fontSize: 16,
    marginVertical: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#3bbba4", // Color similar al de los botones de la otra pantalla
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    width: "80%", // Establece un tamaño estándar para los botones
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppointmentScreen;
