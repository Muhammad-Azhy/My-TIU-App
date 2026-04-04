import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import Logo from "../../../assets/pfp.jpg";
import { vS } from "../../Styles/responsive";
import useTheme from "../../Hooks/useTheme"; // your hook

const ROLE_LABELS = {
  guest: "Guest",
  student: "Student",
  lecturer: "Instructor",
  admin: "Admin",
};

const Header = ({ userRole, role }) => {
  const theme = useTheme(); // get current theme colors
  const raw = userRole ?? role ?? "MyTIU";
  const label = ROLE_LABELS[raw] ?? raw;

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
        <Image source={Logo} style={styles.image} />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // paddingTop handled inline for StatusBar
  },
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
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
});
