import React from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import ProfilePhoto from "../../../assets/vergil.jpg";
import NoProfilePhoto from "../../../assets/pfp.jpg";
import { mS, rS, vS } from "../../Styles/responsive";

const BigBox = ({ fadeAnim, scale, randomText, userRole, user }) => {
  const isGuest = userRole === "guest";
  return (
    <Animated.View style={[styles.bigBox, { opacity: fadeAnim }]}>
      <View style={styles.funnyTextContainer}>
        <Animated.Text
          style={[
            styles.funnyText,
            { transform: [{ scale }, { rotate: "15deg" }] },
          ]}
        >
          {randomText}
        </Animated.Text>
      </View>
      <Image
        source={isGuest ? NoProfilePhoto : ProfilePhoto}
        style={styles.profilePhoto}
      />
      <Text style={styles.profileName}>
        {isGuest ? "Hello, Guest" : `Hello, ${user.name}`}
      </Text>
      <Text style={styles.profileId}>ID: {isGuest ? "--" : user.id}</Text>
      <Text style={styles.profileGrade}>
        Grade: {isGuest ? "--" : user.grade}
      </Text>
      <Text style={styles.profileSem}>
        Semester: {isGuest ? "--" : user.semester}
      </Text>
      <Text style={styles.profileGPA}>GPA: {isGuest ? "--" : user.gpa}</Text>
    </Animated.View>
  );
};

export default BigBox;

const styles = StyleSheet.create({
  bigBox: {
    width: "100%",
    minHeight: vS(250),
    backgroundColor: "#720e3d",
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
  profileName: {
    fontSize: rS(20),
    fontWeight: "bold",
    color: "#fff",
  },
  profileId: {
    fontSize: rS(18),
    color: "#fff",
    marginTop: rS(4),
  },
  profileGrade: {
    fontSize: rS(17),
    color: "#fff",
  },
  profileSem: {
    fontSize: rS(16),
    color: "#fff",
  },
  profileGPA: {
    fontSize: rS(14),
    color: "#fff",
    marginTop: rS(4),
  },
  funnyTextContainer: {
    position: "absolute",
    top: rS(35),
    right: rS(20),
    width: rS(120),
    justifyContent: "center",
    alignItems: "center",
  },
  funnyText: {
    color: "#fff",
    fontSize: rS(15),
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
  },
});
