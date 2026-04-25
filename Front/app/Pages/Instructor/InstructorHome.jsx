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

export default function InstructorHome({ navigation }) {
  useScreenPerformance("Instructor Home Screen");

  const themeMode = useSelector((s) => s.theme.mode);
  const profile = useSelector((s) => s.user.data);
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const user = profile || {
    name: "Instructor",
    id: "--",
    department: "—",
    position: "Lecturer",
  };

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
          toValue: 1.12,
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
        userRole="lecturer"
        theme={theme}
      />

      <View style={styles.row}>
        <QuickTile
          title="My classes"
          color={theme.specialBoxes.courses}
          icon="school"
          theme={theme}
          onPress={() =>
            goTab("InstructorClassesTab", { screen: "InstructorClassesList" })
          }
        />
        <QuickTile
          title="Post announcement"
          color={theme.specialBoxes.assignments}
          icon="campaign"
          theme={theme}
          onPress={() => navigation.navigate("InstructorPostAnnouncement")}
        />
      </View>
      <View style={styles.row}>
        <QuickTile
          title="Assignments"
          color={theme.specialBoxes.assignments}
          icon="assignment"
          theme={theme}
          onPress={() => navigation.navigate("InstructorAssignments")}
        />
        <QuickTile
          title="Grade students"
          color={theme.specialBoxes.grades}
          icon="grading"
          theme={theme}
          onPress={() => navigation.navigate("InstructorGradeStudents")}
        />
      </View>
      <View style={styles.row}>
        <QuickTile
          title="Messages"
          color={theme.specialBoxes.schedule}
          icon="forum"
          theme={theme}
          onPress={() => navigation.navigate("InstructorMessages")}
        />
        <QuickTile
          title="News"
          color={theme.secondary}
          icon="article"
          theme={theme}
          onPress={() => goTab("InstructorNewsTab")}
        />
      </View>
      <View style={styles.row}>
        <QuickTile
          title="Settings"
          color={theme.specialBoxes.settings}
          icon="settings"
          theme={theme}
          onPress={() =>
            goTab("InstructorSettingsTab", { screen: "InstructorSettingsMain" })
          }
        />
        <View style={styles.tileSpacer} />
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
  tileSpacer: { width: "48%" },
  tileIcon: { position: "absolute" },
  tileText: {
    fontSize: mS(16),
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: rS(6),
  },
});
