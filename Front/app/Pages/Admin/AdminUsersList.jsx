import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";

const MOCK_USERS = [
  {
    id: "u1",
    name: "Sara Ahmed",
    email: "sara.a@std.tiu.edu.iq",
    role: "Student",
  },
  {
    id: "u2",
    name: "Dr. Karim Hassan",
    email: "k.hassan@tiu.edu.iq",
    role: "Instructor",
  },
  {
    id: "u3",
    name: "Office Registrar",
    email: "registrar@admin.tiu.edu.iq",
    role: "Admin",
  },
  {
    id: "u4",
    name: "Omar Ali",
    email: "omar.ali@std.tiu.edu.iq",
    role: "Student",
  },
];

export default function AdminUsersList({ navigation }) {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_USERS;
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>User directory</Text>
      <Text style={[styles.hint, { color: theme.subText }]}>
        Read-only demo list. Full search and edits will use the API later.
      </Text>
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
            title={item.name}
            subtitle={item.email}
            meta={item.role}
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
