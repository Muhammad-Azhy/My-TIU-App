import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { adminApi } from "../../services/api";

export default function AdminUsersList({ navigation }) {
  useScreenPerformance("Admin Users List Screen");

  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await adminApi.users();
        setUsers(response.data || []);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || "Failed to load users.");
      }
    };
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [query, users]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        User directory
      </Text>
      <Text style={[styles.hint, { color: theme.subText }]}>
        Users from the live backend.
      </Text>
      {error ? <Text style={{ color: "#d14343", paddingHorizontal: rS(16), marginBottom: rS(8) }}>{error}</Text> : null}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search name, email, or role"
        placeholderTextColor={theme.subText}
        style={[
          styles.search,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ListCard
            title={`${item.firstName} ${item.lastName}`}
            subtitle={item.email}
            meta={item.role.toLowerCase()}
            theme={theme}
            onPress={() =>
              navigation.navigate("AdminUserDetail", { user: item })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.subText, textAlign: "center" }}>
            No matches.
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
  },
  hint: {
    fontSize: mS(13),
    paddingHorizontal: rS(16),
    marginTop: rS(6),
    marginBottom: rS(12),
  },
  search: {
    marginHorizontal: rS(16),
    marginBottom: rS(12),
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    fontSize: mS(16),
  },
  list: { paddingHorizontal: rS(16), paddingBottom: rS(24) },
});
