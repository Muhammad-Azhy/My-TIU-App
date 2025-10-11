import React, { useMemo, useRef, useEffect } from "react";
import { ScrollView, StyleSheet, Animated } from "react-native";
import { useSelector } from "react-redux";
import staticTexts from "../../staticText.json";
import { rS } from "../../Styles/responsive";

import BigBox from "../../Components/Other/BigBox";
import SmallBox from "../../Components/Other/SmallBox";
import course from "../../../assets/courses.png";
const Dashboard = () => {
  const userRole = useSelector((s) => s.user.role);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const dummyUser = {
    id: "69696969",
    grade: "4",
    semester: "2",
    gpa: "4.0",
    name: "Vergil",
  };

  const boxes = [
    {
      title: "Assignments",
      screen: "MoreInfo",
      color: "#E0A500",
      icon: "assignment",
      guestAvailable: false,
    },
    {
      title: "Courses",
      screen: "Courses",
      color: "#3A7BD5",
      icon: "menu-book",
      guestAvailable: false,
    },
    {
      title: "Schedule",
      screen: "MoreInfo",
      color: "#6BBF59",
      icon: "schedule",
      guestAvailable: false,
    },

    {
      title: "Grades",
      screen: "MoreInfo",
      color: "#B85050",
      icon: "grading",
      guestAvailable: false,
    },
    {
      title: "Tuition & Fees",
      screen: "MoreInfo",
      color: "#D9C45A",
      icon: "payment",
      guestAvailable: false,
    },
    {
      title: "Settings",
      screen: "MoreInfo",
      color: "#7A7A7A",
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
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      <BigBox
        fadeAnim={fadeAnim}
        scale={scale}
        randomText={randomText}
        user={dummyUser}
        userRole={userRole}
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
        />
      ))}
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: rS(12),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
