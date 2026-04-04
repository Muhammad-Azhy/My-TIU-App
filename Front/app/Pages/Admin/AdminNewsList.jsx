import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { removeManagedNews } from "../../Redux/Slices/Admin/adminSlice";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";

export default function AdminNewsList({ navigation }) {
  const mode = useSelector((s) => s.theme.mode);
  const items = useSelector((s) => s.admin.managedNews);
  const dispatch = useDispatch();
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const confirmDelete = (id, title) => {
    Alert.alert(
      "Remove news?",
      `"${title}" will be removed from this demo list.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeManagedNews(id)),
        },
      ]
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
        Tap a row to edit. Changes stay in this app session (Redux demo).
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View>
            <ListCard
              title={item.title}
              subtitle={item.content}
              meta={`${item.departmentLabel} · ${new Date(
                item.updatedAt
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
