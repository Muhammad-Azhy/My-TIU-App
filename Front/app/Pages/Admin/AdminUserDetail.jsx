import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS } from "../../Styles/responsive";

function Row({ label, value, theme }) {
  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value || "—"}</Text>
    </View>
  );
}

export default function AdminUserDetail({ route }) {
  const { user } = route.params || {};
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.heading, { color: theme.text }]}>User</Text>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Row label="Name" value={user?.name} theme={theme} />
        <Row label="Email" value={user?.email} theme={theme} />
        <Row label="Role" value={user?.role} theme={theme} />
        <Row label="ID" value={user?.id} theme={theme} />
      </View>
      <Text style={[styles.note, { color: theme.subText }]}>
        Editing and account actions will be available when the admin API is
        connected.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(32) },
  heading: {
    fontSize: mS(22),
    fontWeight: "bold",
    marginBottom: rS(16),
  },
  card: { borderRadius: rS(12), overflow: "hidden" },
  row: {
    paddingVertical: rS(14),
    paddingHorizontal: rS(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: mS(13), marginBottom: rS(4) },
  value: { fontSize: mS(16), fontWeight: "500" },
  note: { fontSize: mS(13), marginTop: rS(16), lineHeight: mS(20) },
});
