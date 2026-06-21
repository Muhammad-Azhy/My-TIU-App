import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import Logo from "../../../assets/pfp.jpg";
import { vS, mS } from "../../Styles/responsive";
import useTheme from "../../Hooks/useTheme";
import { fetchUnreadCount } from "../../Redux/Slices/Notifications/notificationsAction";

const ROLE_LABELS = {
  guest: "Guest",
  student: "Student",
  lecturer: "Instructor",
  admin: "Admin",
};

const Header = ({ userRole, role, navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const unreadCount = useSelector((s) => s.notifications.unreadCount);
  const raw = userRole ?? role ?? "MyTIU";
  const label = ROLE_LABELS[raw] ?? raw;
  const isAuthenticated = raw && raw !== "guest";

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
      const interval = setInterval(() => dispatch(fetchUnreadCount()), 60000);
      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated]);

  const openNotifications = () => {
    if (navigation?.navigate) {
      navigation.navigate("Notifications");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.secondary,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <View style={[styles.header, { backgroundColor: theme.secondary }]}>
        <Text style={[styles.title, { color: theme.textSec }]}>{label}</Text>
        <View style={styles.actions}>
          {isAuthenticated ? (
            <TouchableOpacity
              onPress={openNotifications}
              style={styles.bellBtn}
              accessibilityLabel="Notifications"
            >
              <Icon name="notifications" size={mS(26)} color={theme.textSec} />
              {unreadCount > 0 ? (
                <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}
          <Image source={Logo} style={styles.image} />
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {},
  header: {
    height: vS(60),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: vS(10),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: vS(8),
  },
  bellBtn: {
    padding: vS(4),
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: mS(18),
    height: mS(18),
    borderRadius: mS(9),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: mS(4),
  },
  badgeText: {
    color: "#fff",
    fontSize: mS(10),
    fontWeight: "700",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
});
