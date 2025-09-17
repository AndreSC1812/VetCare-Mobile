import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getReportById } from "../api/reports"; // Make sure you have the API to get a report by ID

const ReportDetailScreen = ({ route }) => {
  const { reportId } = route.params; // Get reportId from route parameters
  const [report, setReport] = useState(null); // State for the report
  const [loading, setLoading] = useState(true); // Loading indicator

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true); // Activate loading indicator
        const response = await getReportById(reportId); // Fetch full report using API
        setReport(response.data.report); // Save the report
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchReportDetails(); // Call the function on component mount
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
        <Text>Unable to load the report.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report Details</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Owner Name:</Text>
        <Text style={styles.cardText}>{report.ownerName}</Text>

        <Text style={styles.sectionTitle}>Owner Phone:</Text>
        <Text style={styles.cardText}>{report.ownerPhone}</Text>

        <Text style={styles.sectionTitle}>Owner Email:</Text>
        <Text style={styles.cardText}>{report.ownerEmail}</Text>

        <Text style={styles.sectionTitle}>Pet Name:</Text>
        <Text style={styles.cardText}>{report.petName}</Text>

        <Text style={styles.sectionTitle}>Chip Number:</Text>
        <Text style={styles.cardText}>{report.chipNumber}</Text>

        <Text style={styles.sectionTitle}>Species:</Text>
        <Text style={styles.cardText}>{report.species}</Text>

        <Text style={styles.sectionTitle}>Weight:</Text>
        <Text style={styles.cardText}>{report.weight}</Text>

        <Text style={styles.sectionTitle}>Consultation Date:</Text>
        <Text style={styles.cardText}>
          {new Date(report.consultationDate).toLocaleDateString()}
        </Text>

        <Text style={styles.sectionTitle}>Reason for Consultation:</Text>
        <Text style={styles.cardText}>{report.consultationReason}</Text>

        <Text style={styles.sectionTitle}>Clinical Signs:</Text>
        <Text style={styles.cardText}>{report.clinicalSigns}</Text>

        <Text style={styles.sectionTitle}>Diagnosis:</Text>
        <Text style={styles.cardText}>{report.diagnosis}</Text>

        <Text style={styles.sectionTitle}>Treatment:</Text>
        <Text style={styles.cardText}>{report.treatment}</Text>

        <Text style={styles.sectionTitle}>Recommendations:</Text>
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
