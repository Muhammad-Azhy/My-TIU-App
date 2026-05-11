import React, { useMemo, useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Animated,
  Text,
  Pressable,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import staticTexts from "../../staticText.json";
import { rS, mS } from "../../Styles/responsive";
import BigBox from "../../Components/Other/BigBox";
import { darkTheme, lightTheme } from "../../Styles/theme";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { toDashboardUser } from "../../utils/dashboardUser";

function QuickTile({ title, color, icon, onPress, theme }) {
  return (
    <Pressable
      style={[styles.tile, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={mS(56)}
        color="rgba(255,255,255,0.2)"
        style={styles.tileIcon}
      />
      <Text style={[styles.tileText, { color: theme.textSec }]}>{title}</Text>
    </Pressable>
  );
}

export default function StudentHome({ navigation }) {
  useScreenPerformance("Student Home Screen");

  const themeMode = useSelector((s) => s.theme.mode);
  const profile = useSelector((s) => s.user.data);
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const user = toDashboardUser(profile);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const pulse = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const randomText = useMemo(() => {
    const texts = staticTexts.Dashboard.Random_Texts;
    return texts[Math.floor(Math.random() * texts.length)];
  }, []);

  const goTab = (tabName, params) => {
    navigation.getParent()?.navigate(tabName, params);
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.container}
    >
      <BigBox
        fadeAnim={fadeAnim}
        scale={scale}
        randomText={randomText}
        user={user}
        userRole="student"
        theme={theme}
      />

      <View style={styles.row}>
        <QuickTile
          title="My courses"
          color={theme.specialBoxes.courses}
          icon="menu-book"
          theme={theme}
          onPress={() =>
            goTab("StudentCoursesTab", { screen: "StudentCoursesList" })
          }
        />
        <QuickTile
          title="Announcements"
          color={theme.specialBoxes.assignments}
          icon="campaign"
          theme={theme}
          onPress={() => navigation.navigate("StudentAnnouncements")}
        />
      </View>
      <View style={styles.row}>
        <QuickTile
          title="Assignments"
          color={theme.specialBoxes.assignments}
          icon="assignment"
          theme={theme}
          onPress={() =>
            goTab("StudentCoursesTab", { screen: "StudentAssignments" })
          }
        />
        <QuickTile
          title="News"
          color={theme.secondary}
          icon="article"
          theme={theme}
          onPress={() => goTab("StudentNewsTab")}
        />
      </View>
      <View style={styles.row}>
        <QuickTile
          title="Settings"
          color={theme.specialBoxes.settings}
          icon="settings"
          theme={theme}
          onPress={() =>
            goTab("StudentSettingsTab", { screen: "StudentSettingsMain" })
          }
        />
        <View style={{ width: "48%" }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    padding: rS(12),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: rS(12),
  },
  tile: {
    width: "48%",
    height: rS(120),
    borderRadius: rS(12),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  tileIcon: { position: "absolute" },
  tileText: {
    fontSize: mS(16),
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: rS(6),
  },
});
