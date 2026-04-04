import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS } from "../../Styles/responsive";

export default function StudentAnnouncementDetail({ route }) {
  const { title, body, date } = route.params || {};
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.date, { color: theme.subText }]}>{date}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.text }]}>{body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(32) },
  date: { fontSize: mS(14), marginBottom: rS(8) },
  title: {
    fontSize: mS(22),
    fontWeight: "bold",
    marginBottom: rS(16),
  },
  body: { fontSize: mS(16), lineHeight: mS(24) },
});
