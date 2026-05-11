import React, { useEffect, useMemo, useState } from "react";
import {
  SectionList,
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import DepartmentBox from "../../Components/Other/DepartmentBox";
import { rS } from "../../Styles/responsive";
import useTheme from "../../Hooks/useTheme";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { guestApi, getApiErrorMessage } from "../../services/api";

const groupDepartments = (departments) => {
  const groups = {};
  departments.forEach((dept) => {
    const letter = dept.name[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(dept);
  });
  return Object.keys(groups)
    .sort()
    .map((letter) => ({ title: letter, data: groups[letter] }));
};

export default function Departments() {
  useScreenPerformance("Departments Screen");
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const theme = useTheme();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await guestApi.departments();
        const mapped = (response.data || []).map((dept) => ({
          id: String(dept.id),
          name: dept.name,
          code: dept.code,
          icon: "apartment",
          "light-color": "#7c5cff",
          "dark-color": "#4f3cae",
        }));
        setDepartments(mapped);
      } catch (apiError) {
        setDepartments([]);
        setError(getApiErrorMessage(apiError, "Failed to load departments."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredDepartments = useMemo(() => {
    if (!search) return departments;
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, departments]);

  const sections = useMemo(
    () => groupDepartments(filteredDepartments),
    [filteredDepartments],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <TextInput
          placeholder="Search Departments..."
          placeholderTextColor={theme.subText}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.searchInput,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DepartmentBox dept={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={[
              styles.sectionHeader,
              { backgroundColor: theme.background },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {title}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: rS(24) }} color={theme.primary} />
          ) : (
            <Text style={{ color: error ? "#b00020" : theme.subText, textAlign: "center" }}>
              {error || "No departments found."}
            </Text>
          )
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rS(12),
    paddingBottom: rS(12),
  },
  searchContainer: {
    padding: rS(12),
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: rS(10),
    paddingHorizontal: rS(12),
    height: rS(40),
    fontSize: rS(16),
  },
  sectionHeader: {
    backgroundColor: "#f0f0f0",
    paddingVertical: rS(5),
    paddingHorizontal: rS(8),
    borderRadius: rS(5),
    marginTop: rS(10),
  },
  sectionTitle: {
    fontSize: rS(16),
    fontWeight: "bold",
    color: "#333",
  },
});
