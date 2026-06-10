import React from "react";
import { Text, StyleSheet, Animated, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { rS, mS } from "../../Styles/responsive";
import { useSelector } from "react-redux";
import PressableScale from "../animations/PressableScale";

const SmallBox = ({
  title,
  anim,
  targetScreen,
  color,
  icon,
  guestAvailable,
  theme,
}) => {
  const navigation = useNavigation();
  const userRole = useSelector((state) => state.user.role);
  const isLockedForGuest = userRole === "guest" && guestAvailable === false;

  const displayColor = isLockedForGuest ? "#1a1a1a" : color;

  return (
    <Animated.View
      style={[
        styles.box,
        { transform: [{ translateY: anim }], backgroundColor: displayColor },
      ]}
    >
      <PressableScale
        style={styles.pressable}
        onPress={() => {
          if (isLockedForGuest) navigation.navigate("Login");
          else navigation.navigate(targetScreen);
        }}
      >
        <View style={styles.iconLayer} pointerEvents="none">
          <Icon
            name={icon}
            size={mS(80)}
            color="rgba(255,255,255,0.2)"
          />
        </View>
        <Text style={[styles.boxText, { color: theme.textSec }]}>
          {isLockedForGuest ? "Login to view" : title}
        </Text>
      </PressableScale>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  pressable: {
    flex: 1,
    width: "100%",
  },
  iconLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    fontSize: mS(16),
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: rS(8),
    zIndex: 1,
  },
});
