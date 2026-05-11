import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS } from "../../Styles/responsive";
import { studentApi, getApiErrorMessage } from "../../services/api";

export default function StudentGrades() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentApi.grades();
        setGrades(response.data || []);
      } catch (apiError) {
        setGrades([]);
        setError(getApiErrorMessage(apiError, "Failed to load grades."));
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Grades</Text>
      {loading ? <ActivityIndicator size="large" color={theme.primary} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && grades.length === 0 ? (
        <Text style={{ color: theme.subText }}>No grades available yet.</Text>
      ) : null}
      {grades.map((grade) => (
        <View
          key={grade.id}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {grade.assignment?.title}
          </Text>
          <Text style={{ color: theme.subText }}>
            {grade.assignment?.classOffering?.course?.code}
          </Text>
          <Text style={[styles.score, { color: theme.primary }]}>
            Score: {grade.score}
          </Text>
          <Text style={{ color: theme.subText }}>
            {grade.feedback || "No feedback"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(30) },
  title: { fontSize: mS(24), fontWeight: "700", marginBottom: rS(12) },
  card: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    marginBottom: rS(8),
  },
  cardTitle: { fontSize: mS(15), fontWeight: "600", marginBottom: rS(4) },
  score: { fontSize: mS(18), fontWeight: "700", marginVertical: rS(6) },
  error: { color: "#c43d3d", marginBottom: rS(8) },
});
