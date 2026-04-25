import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS } from "../../Styles/responsive";
import { studentApi } from "../../services/api";

export default function StudentAssignments() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentApi.assignments();
        setAssignments(response.data || []);
      } catch (apiError) {
        setError(
          apiError?.response?.data?.message || "Failed to load assignments.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, []);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Assignments</Text>
      {loading ? <ActivityIndicator size="large" color={theme.primary} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && assignments.length === 0 ? (
        <Text style={{ color: theme.subText }}>No assignments available.</Text>
      ) : null}
      {assignments.map((assignment) => (
        <View
          key={assignment.id}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {assignment.title}
          </Text>
          <Text style={{ color: theme.subText }}>
            {assignment.classOffering?.course?.code} - {assignment.classOffering?.course?.title}
          </Text>
          <Text style={{ color: theme.subText, marginTop: 4 }}>
            Due:{" "}
            {assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleDateString()
              : "Not specified"}
          </Text>
          <Text style={{ color: theme.subText, marginTop: 4 }}>
            Attachments: {assignment.files?.length || 0}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(28) },
  title: { fontSize: mS(24), fontWeight: "700", marginBottom: rS(12) },
  card: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    marginBottom: rS(8),
  },
  cardTitle: { fontSize: mS(15), fontWeight: "600" },
  error: { color: "#c43d3d", marginBottom: rS(8) },
});
