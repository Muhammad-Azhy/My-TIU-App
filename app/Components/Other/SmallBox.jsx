import React from "react";
import { Text, Pressable, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { rS, mS, vS } from "../../Styles/responsive";
import { useSelector } from "react-redux";

const SmallBox = ({
  title,
  anim,
  targetScreen,
  color,
  icon,
  guestAvailable,
  userRole,
}) => {
  const navigation = useNavigation();

  const isLockedForGuest = userRole === "guest" && guestAvailable === false;
  const displayColor = isLockedForGuest ? "#1a1a1a" : color;

  return (
    <Animated.View
      style={[
        styles.box,
        { transform: [{ translateY: anim }], backgroundColor: displayColor },
      ]}
    >
      <Pressable
        style={styles.pressable}
        onPress={() => {
          if (!isLockedForGuest) navigation.navigate(targetScreen);
        }}
      >
        <Icon
          name={icon}
          size={mS(80)}
          color="rgba(255,255,255,0.2)"
          style={styles.icon}
        />
        <Text style={styles.boxText}>
          {isLockedForGuest ? "Login to view" : title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default SmallBox;

const styles = StyleSheet.create({
  box: {
    width: "48%",
    height: rS(120),
    borderRadius: rS(12),
    marginBottom: rS(12),
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
  },
  boxText: {
    fontSize: mS(16),
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
