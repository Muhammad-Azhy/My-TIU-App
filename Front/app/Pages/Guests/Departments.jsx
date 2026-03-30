import React, { useMemo, useState } from "react";
import {
  SectionList,
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DepartmentBox from "../../Components/Other/DepartmentBox";
import { rS } from "../../Styles/responsive";
import staticTexts from "../../staticText.json";
import useTheme from "../../Hooks/useTheme";

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
  const [search, setSearch] = useState("");
  const theme = useTheme();

  const filteredDepartments = useMemo(() => {
    if (!search) return staticTexts.departments;
    return staticTexts.departments.filter((dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const sections = useMemo(
    () => groupDepartments(filteredDepartments),
    [filteredDepartments]
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
          style={[styles.searchInput, { backgroundColor: theme.background, color: theme.text }]}
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
          <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
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