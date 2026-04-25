import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { studentApi } from "../../services/api";

export default function Courses() {
  useScreenPerformance("Courses Screen");

  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await studentApi.classes();
        setCourses(response.data || []);
      } catch (_error) {
        setCourses([]);
      }
    };
    load();
  }, []);

  const data = useMemo(
    () =>
      courses.map((enrollment) => {
        const cls = enrollment.classOffering;
        return {
          id: String(enrollment.id),
          code: cls?.course?.code || "N/A",
          name: cls?.course?.title || "Unknown course",
          section: cls?.section || "-",
          meta: `${cls?.semester || "N/A"} · ${cls?.schedule || "TBA"}`,
        };
      }),
    [courses],
  );

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
