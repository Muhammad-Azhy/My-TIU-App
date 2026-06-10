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
import FadeSlideIn from "../../Components/animations/FadeSlideIn";
import { rS } from "../../Styles/responsive";
import useTheme from "../../Hooks/useTheme";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { guestApi, getApiErrorMessage } from "../../services/api";
import { enrichDepartments } from "../../utils/departmentMeta";
import EmptyState from "../../Components/ui/EmptyState";

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
        setDepartments(enrichDepartments(response.data || []));
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
      <FadeSlideIn>
        <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
          <TextInput
            placeholder="Search Departments..."
            placeholderTextColor={theme.subText}
            value={search}
            onChangeText={setSearch}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      </FadeSlideIn>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <FadeSlideIn delay={Math.min(index * 45, 360)}>
            <DepartmentBox dept={item} />
          </FadeSlideIn>
        )}
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
            <ActivityIndicator
              style={{ marginTop: rS(32) }}
              size="large"
              color={theme.primary}
            />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <EmptyState
              icon="apartment"
              title="No departments"
              message="No departments match your search."
              theme={theme}
            />
          )
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rS(12),
    paddingBottom: rS(24),
  },
  searchContainer: {
    padding: rS(12),
  },
  searchInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: rS(12),
    paddingHorizontal: rS(14),
    height: rS(44),
    fontSize: rS(16),
  },
  sectionHeader: {
    paddingVertical: rS(6),
    paddingHorizontal: rS(4),
    marginTop: rS(8),
  },
  sectionTitle: {
    fontSize: rS(15),
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  errorText: {
    color: "#b00020",
    textAlign: "center",
    marginTop: rS(24),
    fontWeight: "600",
  },
});
