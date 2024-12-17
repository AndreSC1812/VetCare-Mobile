import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getReportById } from "../api/reports"; // Asegúrate de tener la API para obtener un informe por ID

const ReportDetailScreen = ({ route }) => {
  const { reportId } = route.params; // Obtenemos el reportId desde los parámetros de la ruta
  const [report, setReport] = useState(null); // Estado para el informe
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true); // Activamos el indicador de carga
        const response = await getReportById(reportId); // Obtenemos el informe completo usando la API
        setReport(response.data.report); // Guardamos el informe
      } catch (error) {
        console.error("Error al obtener el informe:", error);
      } finally {
        setLoading(false); // Terminamos el estado de carga
      }
    };

    fetchReportDetails(); // Llamamos la función cuando se monta la pantalla
  }, [reportId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bbba4" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text>No se pudo cargar el informe.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Informe</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nombre del dueño:</Text>
        <Text style={styles.cardText}>{report.ownerName}</Text>

        <Text style={styles.sectionTitle}>Teléfono del dueño:</Text>
        <Text style={styles.cardText}>{report.ownerPhone}</Text>

        <Text style={styles.sectionTitle}>Email del dueño:</Text>
        <Text style={styles.cardText}>{report.ownerEmail}</Text>

        <Text style={styles.sectionTitle}>Nombre de la Mascota:</Text>
        <Text style={styles.cardText}>{report.petName}</Text>

        <Text style={styles.sectionTitle}>Número de Chip:</Text>
        <Text style={styles.cardText}>{report.chipNumber}</Text>

        <Text style={styles.sectionTitle}>Especie:</Text>
        <Text style={styles.cardText}>{report.species}</Text>

        <Text style={styles.sectionTitle}>Peso:</Text>
        <Text style={styles.cardText}>{report.weight}</Text>

        <Text style={styles.sectionTitle}>Fecha de Consulta:</Text>
        <Text style={styles.cardText}>
          {new Date(report.consultationDate).toLocaleDateString()}
        </Text>

        <Text style={styles.sectionTitle}>Motivo de Consulta:</Text>
        <Text style={styles.cardText}>{report.consultationReason}</Text>

        <Text style={styles.sectionTitle}>Signos Clínicos:</Text>
        <Text style={styles.cardText}>{report.clinicalSigns}</Text>

        <Text style={styles.sectionTitle}>Diagnóstico:</Text>
        <Text style={styles.cardText}>{report.diagnosis}</Text>

        <Text style={styles.sectionTitle}>Tratamiento:</Text>
        <Text style={styles.cardText}>{report.treatment}</Text>

        <Text style={styles.sectionTitle}>Recomendaciones:</Text>
        <Text style={styles.cardText}>{report.recommendations}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3bbba4",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#555",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});

export default ReportDetailScreen;
