import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import ListCard from "../../Components/lists/ListCard";
import { rS, mS } from "../../Styles/responsive";

const MOCK_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Midterm exam schedule",
    excerpt: "CMPE department midterms begin next week. Check room assignments.",
    date: "Apr 2, 2026",
    body: "Midterm examinations for the Computer Engineering department will run April 8–12. Room lists are posted on the department board. Arrive 15 minutes early with your student ID.",
  },
  {
    id: "2",
    title: "Library hours extended",
    excerpt: "Main library open until midnight during finals.",
    date: "Mar 28, 2026",
    body: "During the final examination period, the main library will remain open until midnight on weekdays. Weekend hours are unchanged.",
  },
  {
    id: "3",
    title: "Registration reminder",
    excerpt: "Add/drop period closes this Friday.",
    date: "Mar 25, 2026",
    body: "The add/drop window for the current semester closes Friday at 5:00 PM. Contact your advisor for course changes after that date.",
  },
];

export default function StudentAnnouncements({ navigation }) {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const data = useMemo(() => MOCK_ANNOUNCEMENTS, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Announcements</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ListCard
            title={item.title}
            subtitle={item.excerpt}
            meta={item.date}
            theme={theme}
            onPress={() =>
              navigation.navigate("StudentAnnouncementDetail", {
                title: item.title,
                body: item.body,
                date: item.date,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.subText, textAlign: "center" }}>
            No announcements yet.
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
