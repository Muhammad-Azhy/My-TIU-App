import React from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import ProfilePhoto from "../../../assets/vergil.jpg";
import NoProfilePhoto from "../../../assets/pfp.jpg";
import { mS, rS, vS } from "../../Styles/responsive";

const BigBox = ({ fadeAnim, scale, randomText, userRole, user, theme }) => {
  const isGuest = userRole === "guest";
  return (
    <Animated.View
      style={[
        styles.bigBox,
        { opacity: fadeAnim, backgroundColor: theme.secondary },
      ]}
    >
      <View style={styles.funnyTextContainer}>
        <Animated.Text
          style={[
            styles.funnyText,
            {
              transform: [{ scale }, { rotate: "15deg" }],
              color: theme.textSec,
            },
          ]}
        >
          {randomText}
        </Animated.Text>
      </View>
      <Image
        source={isGuest ? NoProfilePhoto : ProfilePhoto}
        style={styles.profilePhoto}
      />
      <Text style={[styles.profileName, { color: theme.textSec }]}>
        {isGuest ? "Hello, Guest" : `Hello, ${user.name}`}
      </Text>
      <Text style={[styles.profileId, { color: theme.textSec }]}>
        ID: {isGuest ? "--" : user.id}
      </Text>
      <Text style={[styles.profileGrade, { color: theme.textSec }]}>
        Grade: {isGuest ? "--" : user.grade}
      </Text>
      <Text style={[styles.profileSem, { color: theme.textSec }]}>
        Semester: {isGuest ? "--" : user.semester}
      </Text>
      <Text style={[styles.profileGPA, { color: theme.textSec }]}>
        GPA: {isGuest ? "--" : user.gpa}
      </Text>
    </Animated.View>
  );
};

export default BigBox;

const styles = StyleSheet.create({
  bigBox: {
    width: "100%",
    minHeight: vS(250),
    borderRadius: mS(12),
    padding: rS(15),
    marginBottom: vS(12),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
  },
  profilePhoto: {
    width: rS(130),
    height: vS(100),
    borderRadius: rS(10),
    marginBottom: rS(10),
  },
  profileName: { fontSize: rS(20), fontWeight: "bold" },
  profileId: { fontSize: rS(18), marginTop: rS(4) },
  profileGrade: { fontSize: rS(17) },
  profileSem: { fontSize: rS(16) },
  profileGPA: { fontSize: rS(14), marginTop: rS(4) },
  funnyTextContainer: {
    position: "absolute",
    top: rS(35),
    right: rS(20),
    width: rS(120),
    justifyContent: "center",
    alignItems: "center",
  },
  funnyText: {
    fontSize: rS(15),
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
  },
});
