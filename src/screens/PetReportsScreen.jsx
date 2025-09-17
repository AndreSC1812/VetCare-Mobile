import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getReportsByPet } from "../api/reports";

const PetReportsScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await getReportsByPet(petId);
        setReports(response.data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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
      <Text style={styles.title}>Pet Reports</Text>

      {reports.length > 0 ? (
        reports.map((report) => (
          <TouchableOpacity
            key={report._id}
            style={styles.reportItem}
            onPress={() =>
              navigation.navigate("ReportDetail", {
                reportId: report._id,
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
        <Text>No reports available for this pet.</Text>
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
