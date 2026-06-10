import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { studentApi, getApiErrorMessage } from "../../services/api";
import PageHeader from "../../Components/ui/PageHeader";
import EmptyState from "../../Components/ui/EmptyState";

export default function Courses() {
  useScreenPerformance("Courses Screen");

  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentApi.classes();
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (apiError) {
        setCourses([]);
        setError(getApiErrorMessage(apiError, "Could not load courses."));
      } finally {
        setLoading(false);
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
      <View style={styles.headerWrap}>
        <PageHeader title="My courses" subtitle="Enrolled classes this term." theme={theme} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: rS(16) }} />
      ) : null}
      {error ? (
        <Text style={[styles.err, { color: "#b00020" }]}>{error}</Text>
      ) : null}
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
          !loading && !error ? (
            <EmptyState
              icon="school"
              title="No enrollments"
              message="You are not enrolled in any courses yet."
              theme={theme}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: rS(12) },
  headerWrap: { paddingHorizontal: rS(12), marginBottom: rS(4) },
  err: {
    textAlign: "center",
    marginHorizontal: rS(16),
    marginBottom: rS(8),
    fontWeight: "600",
  },
  list: { paddingHorizontal: rS(16), paddingBottom: rS(24) },
});
