import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS, vS } from "../../Styles/responsive";
import { studentApi, getApiErrorMessage } from "../../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import BackBar from "../../Components/ui/BackBar";
import AppCard from "../../Components/ui/AppCard";
import FadeSlideIn from "../../Components/animations/FadeSlideIn";
import EmptyState from "../../Components/ui/EmptyState";

function formatDeadline(dueDate) {
  if (!dueDate) return "Not specified";
  return new Date(dueDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AssignmentCard({ assignment, theme, index }) {
  return (
    <FadeSlideIn delay={Math.min(index * 50, 300)}>
      <AppCard theme={theme} style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {assignment.title}
        </Text>
        <Text style={[styles.description, { color: theme.text }]}>
          {assignment.description?.trim() || "No description provided."}
        </Text>
        <View style={styles.deadlineRow}>
          <Icon name="event" size={mS(15)} color={theme.primary} />
          <Text style={[styles.deadline, { color: theme.subText }]}>
            Deadline: {formatDeadline(assignment.dueDate)}
          </Text>
        </View>
      </AppCard>
    </FadeSlideIn>
  );
}

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
        setAssignments([]);
        setError(getApiErrorMessage(apiError, "Failed to load assignments."));
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
      showsVerticalScrollIndicator={false}
    >
      <BackBar title="Assignments" />
      <Text style={[styles.subtitle, { color: theme.subText }]}>
        View and track your course assignments. Submission is not available in
        this version.
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: vS(24) }}
        />
      ) : null}

      {error ? (
        <View
          style={[
            styles.errBox,
            { backgroundColor: "#b0002012", borderColor: "#b00020" },
          ]}
        >
          <Icon name="error-outline" size={mS(18)} color="#b00020" />
          <Text style={styles.errText}>{error}</Text>
        </View>
      ) : null}

      {!loading && !error && assignments.length === 0 ? (
        <EmptyState
          icon="assignment"
          title="No assignments"
          message="You have no assignments listed for your enrolled classes."
          theme={theme}
        />
      ) : null}

      {assignments.map((a, index) => (
        <AssignmentCard
          key={String(a.id)}
          assignment={a}
          theme={theme}
          index={index}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(40) },
  subtitle: {
    fontSize: mS(13),
    lineHeight: mS(19),
    marginBottom: rS(16),
    marginTop: rS(4),
  },
  errBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: rS(8),
    borderWidth: 1,
    borderRadius: rS(12),
    padding: rS(12),
    marginBottom: rS(14),
  },
  errText: { color: "#b00020", fontSize: mS(13), flex: 1 },
  card: { marginBottom: rS(10) },
  cardTitle: {
    fontSize: mS(16),
    fontWeight: "700",
    marginBottom: vS(8),
    lineHeight: mS(22),
  },
  description: {
    fontSize: mS(14),
    lineHeight: mS(21),
    marginBottom: vS(12),
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: rS(6),
    paddingTop: vS(4),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.25)",
  },
  deadline: {
    fontSize: mS(13),
    fontWeight: "600",
  },
});
