import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";

/** Mock enrolled courses until API is wired */
const MOCK_COURSES = [
  {
    id: "1",
    code: "CMPE 301",
    name: "Data Structures",
    section: "A",
    meta: "Spring · Mon/Wed 10:00",
  },
  {
    id: "2",
    code: "CMPE 302",
    name: "Database Systems",
    section: "B",
    meta: "Spring · Tue 14:00",
  },
  {
    id: "3",
    code: "MATH 201",
    name: "Calculus II",
    section: "A",
    meta: "Spring · Daily 08:00",
  },
];

export default function Courses() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const data = useMemo(() => MOCK_COURSES, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>My courses</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ListCard
            title={`${item.code} · Section ${item.section}`}
            subtitle={item.name}
            meta={item.meta}
            theme={theme}
            icon="menu-book"
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.subText, textAlign: "center" }}>
            You are not enrolled in any courses yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: rS(12) },
  heading: {
    fontSize: mS(22),
    fontWeight: "bold",
    paddingHorizontal: rS(16),
    marginBottom: rS(8),
  },
  list: { paddingHorizontal: rS(16), paddingBottom: rS(24) },
});
