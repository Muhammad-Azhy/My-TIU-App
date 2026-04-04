import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";

const MOCK_CLASSES = [
  {
    id: "1",
    code: "CMPE 301",
    name: "Data Structures",
    section: "A",
    meta: "32 students · Mon/Wed 10:00",
  },
  {
    id: "2",
    code: "CMPE 410",
    name: "Software Engineering",
    section: "B",
    meta: "28 students · Tue 14:00",
  },
  {
    id: "3",
    code: "CMPE 220",
    name: "Programming II",
    section: "A",
    meta: "40 students · Daily 09:00",
  },
];

export default function InstructorClasses() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const data = useMemo(() => MOCK_CLASSES, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>My classes</Text>
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
            icon="school"
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.subText, textAlign: "center" }}>
            No classes assigned yet.
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
