import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";
import { guestApi, getApiErrorMessage } from "../../services/api";
import BackBar from "../../Components/ui/BackBar";

export default function StudentAnnouncements({ navigation }) {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await guestApi.announcements();
        setAnnouncements(response.data || []);
      } catch (apiError) {
        setAnnouncements([]);
        setError(
          getApiErrorMessage(apiError, "Failed to load announcements."),
        );
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <BackBar title="Announcements" />
      {loading ? <ActivityIndicator size="large" color={theme.primary} /> : null}
      {error ? (
        <Text style={{ color: "#d14343", paddingHorizontal: rS(16), marginBottom: rS(8) }}>
          {error}
        </Text>
      ) : null}
      <FlatList
        data={announcements}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ListCard
            title={item.title}
            subtitle={(item.content || "").slice(0, 90)}
            meta={new Date(item.createdAt).toLocaleDateString()}
            theme={theme}
            onPress={() =>
              navigation.navigate("StudentAnnouncementDetail", {
                announcementId: item.id,
                title: item.title,
                body: item.content,
                date: new Date(item.createdAt).toLocaleDateString(),
                files: item.files || [],
              })
            }
          />
        )}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={{ color: theme.subText, textAlign: "center" }}>
              No announcements yet.
            </Text>
          ) : null
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
