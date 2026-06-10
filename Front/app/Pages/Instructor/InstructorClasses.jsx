import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { lecturerApi } from "../../services/api";

export default function InstructorClasses() {
  useScreenPerformance("Instructor Classes Screen");

  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await lecturerApi.classes();
        setClasses(response.data || []);
      } catch (_error) {
        setClasses([]);
      }
    };
    load();
  }, []);

  const data = useMemo(
    () =>
      classes.map((item) => ({
        id: String(item.id),
        code: item.course?.code || "N/A",
        name: item.course?.title || "Unknown course",
        section: item.section || "-",
        meta: `${item.enrollments?.length || 0} students · ${item.schedule || "TBA"}`,
      })),
    [classes],
  );

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
