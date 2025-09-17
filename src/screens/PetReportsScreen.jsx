import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getReportsByPet } from "../api/reports"; // Asegúrate de tener la API de informes

const PetReportsScreen = ({ route, navigation }) => {
  const { petId } = route.params; // Obtenemos el petId desde los parámetros de la ruta
  const [reports, setReports] = useState([]); // Estado para los informes
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true); // Activamos el indicador de carga
        const response = await getReportsByPet(petId); // Obtenemos los informes de la mascota usando la API
        setReports(response.data.reports); // Guardamos los informes
      } catch (error) {
        console.error("Error al obtener los informes:", error);
      } finally {
        setLoading(false); // Terminamos el estado de carga
      }
    };

    fetchReports(); // Llamamos la función cuando se monta la pantalla
  }, [petId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Informes de la Mascota</Text>
      {/* Aquí puedes mostrar los informes */}
      {reports.length > 0 ? (
        reports.map((report) => (
          <TouchableOpacity
            key={report._id} // Usamos _id, que es la clave única del informe
            style={styles.reportItem}
            onPress={() =>
              navigation.navigate("ReportDetail", {
                reportId: report._id, // Pasamos el reportId a la pantalla de detalles
              })
            }
          >
            <Text style={styles.reportTitle}>{report.petName}</Text>
            <Text>
              {new Date(report.consultationDate).toLocaleDateString()}
            </Text>
            <Text>{report.diagnosis}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No hay informes disponibles para esta mascota.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3bbba4",
    marginBottom: 20,
    marginTop: 40,
  },
  reportItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PetReportsScreen;
