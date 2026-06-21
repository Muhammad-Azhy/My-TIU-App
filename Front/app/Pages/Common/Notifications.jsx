import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS } from "../../Styles/responsive";
import BackBar from "../../Components/ui/BackBar";
import EmptyState from "../../Components/ui/EmptyState";
import ListCard from "../../Components/lists/ListCard";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../Redux/Slices/Notifications/notificationsAction";

const TYPE_ICONS = {
  ASSIGNMENT: "assignment",
  ANNOUNCEMENT: "campaign",
  GRADE: "grade",
  NEWS: "article",
  ENROLLMENT: "school",
  CLASS_ASSIGNMENT: "class",
};

function formatWhen(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function navigateForNotification(navigation, role, notification) {
  const { type, title, body, createdAt } = notification;

  if (role === "student") {
    switch (type) {
      case "ASSIGNMENT":
        navigation.navigate("StudentTabs", {
          screen: "StudentCoursesTab",
          params: { screen: "StudentAssignments" },
        });
        return;
      case "ANNOUNCEMENT":
        navigation.navigate("StudentTabs", {
          screen: "StudentHomeTab",
          params: {
            screen: "StudentAnnouncementDetail",
            params: {
              title,
              body: body || "",
              date: formatWhen(createdAt),
            },
          },
        });
        return;
      case "GRADE":
        navigation.navigate("StudentTabs", {
          screen: "StudentCoursesTab",
          params: { screen: "StudentAssignments" },
        });
        return;
      case "NEWS":
        navigation.navigate("StudentTabs", { screen: "StudentNewsTab" });
        return;
      case "ENROLLMENT":
        navigation.navigate("StudentTabs", { screen: "StudentCoursesTab" });
        return;
      default:
        break;
    }
  }

  if (role === "lecturer") {
    switch (type) {
      case "CLASS_ASSIGNMENT":
        navigation.navigate("InstructorTabs", { screen: "InstructorClassesTab" });
        return;
      case "NEWS":
        navigation.navigate("InstructorTabs", { screen: "InstructorNewsTab" });
        return;
      default:
        break;
    }
  }

  if (role === "admin") {
    switch (type) {
      case "NEWS":
        navigation.navigate("AdminTabs", { screen: "AdminNewsTab" });
        return;
      default:
        break;
    }
  }
}

export default function Notifications({ navigation }) {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);
  const role = useSelector((s) => s.user.role);
  const { items, loading, unreadCount } = useSelector((s) => s.notifications);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications());
    }, [dispatch]),
  );

  const handlePress = async (notification) => {
    if (!notification.readAt) {
      dispatch(markNotificationRead(notification.id));
    }
    navigateForNotification(navigation, role, notification);
  };

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsRead());
    }
  };

  const renderItem = ({ item }) => {
    const unread = !item.readAt;
    return (
      <View style={unread ? styles.unreadWrap : null}>
        <ListCard
          title={item.title}
          subtitle={item.body}
          meta={formatWhen(item.createdAt)}
          icon={TYPE_ICONS[item.type] || "notifications"}
          theme={theme}
          onPress={() => handlePress(item)}
        />
        {unread ? (
          <View style={[styles.dot, { backgroundColor: theme.primary }]} />
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <BackBar title="Notifications" />
      {unreadCount > 0 ? (
        <TouchableOpacity
          style={[styles.markAllBtn, { borderColor: theme.border }]}
          onPress={handleMarkAllRead}
        >
          <Icon name="done-all" size={mS(18)} color={theme.primary} />
          <Text style={[styles.markAllText, { color: theme.primary }]}>
            Mark all as read
          </Text>
        </TouchableOpacity>
      ) : null}

      {loading && items.length === 0 ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={theme.primary}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="notifications-none"
              title="No notifications yet"
              message="You'll see updates about assignments, grades, announcements, and news here."
              theme={theme}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: {
    padding: rS(16),
    paddingBottom: rS(40),
    flexGrow: 1,
  },
  loader: { marginTop: rS(40) },
  unreadWrap: { position: "relative" },
  dot: {
    position: "absolute",
    top: rS(18),
    right: rS(42),
    width: rS(8),
    height: rS(8),
    borderRadius: rS(4),
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginHorizontal: rS(16),
    marginBottom: rS(4),
    paddingVertical: rS(8),
    paddingHorizontal: rS(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: rS(20),
    gap: rS(6),
  },
  markAllText: {
    fontSize: mS(13),
    fontWeight: "600",
  },
});
