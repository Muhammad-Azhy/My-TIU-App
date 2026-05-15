import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import BackBar from "../../Components/ui/BackBar";

function Row({ label, value, theme }) {
  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value || "—"}</Text>
    </View>
  );
}

export default function StudentProfile() {
  useScreenPerformance("Student Profile Screen");

  const mode = useSelector((s) => s.theme.mode);
  const data = useSelector((s) => s.user.data);
  const role = useSelector((s) => s.user.role);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const isInstructor = role === "lecturer";
  const isAdmin = role === "admin";
  const fullName =
    data?.name || `${data?.firstName || ""} ${data?.lastName || ""}`.trim();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <BackBar title="Profile" />
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Row label="Name" value={fullName} theme={theme} />
        <Row
          label={
            isAdmin ? "Admin ID" : isInstructor ? "Staff ID" : "Student ID"
          }
          value={String(data?.id || data?.student?.id || data?.lecturer?.id || "—")}
          theme={theme}
        />
        <Row label="Email" value={data?.email} theme={theme} />
        <Row
          label="Department"
          value={data?.department || data?.student?.department?.name || data?.lecturer?.department?.name}
          theme={theme}
        />
        {isInstructor || isAdmin ? (
          <Row label="Position" value={data?.position} theme={theme} />
        ) : (
          <>
            <Row label="Year" value={data?.year} theme={theme} />
            <Row label="Semester" value={data?.semester} theme={theme} />
            <Row label="GPA" value={data?.gpa} theme={theme} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(32) },
  heading: {
    fontSize: mS(24),
    fontWeight: "bold",
    marginBottom: rS(16),
  },
  card: {
    borderRadius: rS(12),
    overflow: "hidden",
  },
  row: {
    paddingVertical: rS(14),
    paddingHorizontal: rS(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: mS(13), marginBottom: rS(4) },
  value: { fontSize: mS(16), fontWeight: "500" },
});
