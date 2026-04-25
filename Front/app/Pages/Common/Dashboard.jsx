import React, { useMemo, useRef, useEffect } from "react";
import { ScrollView, StyleSheet, Animated } from "react-native";
import { useSelector } from "react-redux";
import staticTexts from "../../staticText.json";
import { rS } from "../../Styles/responsive";

import BigBox from "../../Components/Other/BigBox";
import SmallBox from "../../Components/Other/SmallBox";
import { darkTheme, lightTheme } from "../../Styles/theme";
import useScreenPerformance from "../../Hooks/useScreenPerformance";

const Dashboard = () => {
  useScreenPerformance("Dashboard Screen");
  const userRole = useSelector((s) => s.user.role);
  const userData = useSelector((s) => s.user.data);
  const themeMode = useSelector((s) => s.theme.mode); // get current mode

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const dashboardUser = {
    id: String(userData?.id || userData?.student?.id || "--"),
    grade: userData?.student?.yearLevel ? String(userData.student.yearLevel) : "--",
    semester: "--",
    gpa: "--",
    name:
      userData?.name ||
      `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
      "User",
  };
  const boxes = [
    {
      title: "Assignments",
      screen: "MoreInfo",
      color: theme.specialBoxes.assignments,
      icon: "assignment",
      guestAvailable: false,
    },
    {
      title: "Courses",
      screen: "Courses",
      color: theme.specialBoxes.courses,
      icon: "menu-book",
      guestAvailable: false,
    },
    {
      title: "Schedule",
      screen: "MoreInfo",
      color: theme.specialBoxes.schedule,
      icon: "schedule",
      guestAvailable: false,
    },
    {
      title: "Grades",
      screen: "MoreInfo",
      color: theme.specialBoxes.grades,
      icon: "grading",
      guestAvailable: false,
    },
    {
      title: "Tuition & Fees",
      screen: "MoreInfo",
      color: theme.specialBoxes.tuition,
      icon: "payment",
      guestAvailable: false,
    },
    {
      title: "Settings",
      screen: "GuestSettings",
      color: theme.specialBoxes.settings,
      icon: "settings",
      guestAvailable: true,
    },
  ];
  const boxAnims = useRef(boxes.map(() => new Animated.Value(50))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const animateText = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => animateText());
    };
    if (userRole !== "guest") animateText();

    boxAnims.forEach((anim, index) => {
      anim.setValue(50);
      Animated.timing(anim, {
        toValue: 0,
        duration: 800,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const randomText = useMemo(() => {
    const texts = staticTexts.Dashboard.Random_Texts;
    return texts[Math.floor(Math.random() * texts.length)];
  }, []);

  return (
    <ScrollView
      style={[styles.scrollContainer, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.container}
    >
      <BigBox
        fadeAnim={fadeAnim}
        scale={scale}
        randomText={randomText}
        user={dashboardUser}
        userRole={userRole}
        theme={theme}
      />
      {boxes.map((box, i) => (
        <SmallBox
          key={i}
          title={box.title}
          anim={boxAnims[i]}
          targetScreen={box.screen}
          color={box.color}
          icon={box.icon}
          guestAvailable={box.guestAvailable}
          userRole={userRole}
          theme={theme}
        />
      ))}
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: rS(12),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
