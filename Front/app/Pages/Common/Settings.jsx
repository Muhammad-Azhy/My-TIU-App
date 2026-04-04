import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { rS, mS } from "../../Styles/responsive";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../Redux/Slices/Theme/themeSlice";
import { clearUser } from "../../Redux/Slices/User/userSlice";
import { darkTheme, lightTheme } from "../../Styles/theme";

export default function Settings() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const userRole = useSelector((state) => state.user.role);

  const theme = mode === "dark" ? darkTheme : lightTheme;

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

      {/* ACCOUNT */}
      <Text style={[styles.section, { color: theme.subText }]}>Account</Text>

      {userRole === "guest" ? (
        <SettingsItem
          icon="login"
          title="Login"
          onPress={() => navigation.navigate("Login")}
          theme={theme}
        />
      ) : (
        <>
          <SettingsItem
            icon="person"
            title="Profile"
            onPress={() => navigation.navigate("Profile")}
            theme={theme}
          />

          <SettingsItem
            icon="lock"
            title="Change Password"
            onPress={() => {}}
            theme={theme}
          />

          <SettingsItem
            icon="logout"
            title="Logout"
            onPress={handleLogout}
            danger
            theme={theme}
          />
        </>
      )}

      {/* APP SETTINGS */}
      <Text style={[styles.section, { color: theme.subText }]}>
        App Settings
      </Text>

      <View style={[styles.item, { backgroundColor: theme.card }]}>
        <View style={styles.left}>
          <Icon name="dark-mode" size={20} color={theme.text} />
          <Text style={[styles.text, { color: theme.text }]}>Dark Mode</Text>
        </View>
        <Switch
          value={mode === "dark"}
          onValueChange={() => dispatch(toggleTheme())}
          thumbColor={theme.primary}
        />
      </View>

     

      {/* ABOUT */}
      <Text style={[styles.section, { color: theme.subText }]}>About</Text>

      <SettingsItem
        icon="info"
        title="About App"
        onPress={() => {}}
        theme={theme}
      />

      <SettingsItem
        icon="policy"
        title="Privacy Policy"
        onPress={() => {}}
        theme={theme}
      />

      <View style={[styles.item, { backgroundColor: theme.card }]}>
        <View style={styles.left}>
          <Icon name="system-update" size={20} color={theme.text} />
          <Text style={[styles.text, { color: theme.text }]}>Version</Text>
        </View>
        <Text style={[styles.version, { color: theme.subText }]}>1.0.0</Text>
      </View>
    </ScrollView>
  );
}

function SettingsItem({ icon, title, onPress, danger, theme }) {
  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Icon name={icon} size={20} color={danger ? "red" : theme.text} />
        <Text style={[styles.text, { color: danger ? "red" : theme.text }]}>
          {title}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={theme.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rS(15),
  },

  header: {
    fontSize: mS(24),
    fontWeight: "bold",
    marginBottom: rS(10),
  },

  section: {
    fontSize: mS(14),
    marginTop: rS(15),
    marginBottom: rS(5),
  },

  item: {
    padding: rS(15),
    borderRadius: rS(10),
    marginBottom: rS(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: rS(10),
  },

  text: {
    fontSize: mS(16),
  },

  version: {
    fontSize: mS(14),
  },
});
