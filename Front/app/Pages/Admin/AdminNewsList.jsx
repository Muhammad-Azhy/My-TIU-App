import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { guestApi, adminApi } from "../../services/api";

export default function AdminNewsList({ navigation }) {
  useScreenPerformance("Admin News List Screen");

  const mode = useSelector((s) => s.theme.mode);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const theme = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    const load = async () => {
      try {
        const response = await guestApi.news();
        setItems(response.data || []);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || "Failed to load news.");
      }
    };
    load();
  }, []);

  const confirmDelete = (id, title) => {
    Alert.alert(
      "Remove news?",
      `"${title}" will be removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await adminApi.deleteNews(id);
              setItems((current) => current.filter((item) => item.id !== id));
            } catch (apiError) {
              Alert.alert("Delete failed", apiError?.response?.data?.message || "Unable to delete this item.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.topRow}>
        <Text style={[styles.heading, { color: theme.text }]}>News</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("AdminNewsForm", {})}
          activeOpacity={0.85}
        >
          <Icon name="add" size={mS(22)} color="#1a1a1a" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.hint, { color: theme.subText }]}>
        Tap a row to edit.
      </Text>
      {error ? <Text style={{ color: "#d14343", paddingHorizontal: rS(16), marginBottom: rS(8) }}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View>
            <ListCard
              title={item.title}
              subtitle={item.content}
              meta={`${item.department?.name || "Global"} · ${new Date(
                item.updatedAt,
              ).toLocaleDateString()}`}
              theme={theme}
              onPress={() =>
                navigation.navigate("AdminNewsForm", { itemId: item.id })
              }
            />
            <TouchableOpacity
              style={styles.deleteLink}
              onPress={() => confirmDelete(item.id, item.title)}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.subText, textAlign: "center" }}>
            No news yet. Tap + to add.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: rS(12) },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rS(16),
    marginBottom: rS(4),
  },
  heading: { fontSize: mS(22), fontWeight: "bold" },
  addBtn: {
    width: rS(44),
    height: rS(44),
    borderRadius: rS(12),
    justifyContent: "center",
    alignItems: "center",
  },
  hint: {
    fontSize: mS(13),
    paddingHorizontal: rS(16),
    marginBottom: rS(12),
  },
  list: { paddingHorizontal: rS(16), paddingBottom: rS(24) },
  deleteLink: { alignSelf: "flex-end", marginTop: -rS(4), marginBottom: rS(8) },
  deleteText: { color: "#c44", fontSize: mS(13) },
});
