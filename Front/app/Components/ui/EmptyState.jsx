import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { rS, mS } from "../../Styles/responsive";
import FadeSlideIn from "../animations/FadeSlideIn";

export default function EmptyState({ icon = "inbox", title, message, theme }) {
  return (
    <FadeSlideIn>
      <View style={styles.wrap}>
        <View style={[styles.circle, { backgroundColor: theme.secondary }]}>
          <Icon name={icon} size={mS(40)} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {message ? (
          <Text style={[styles.msg, { color: theme.subText }]}>{message}</Text>
        ) : null}
      </View>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: rS(36),
    paddingHorizontal: rS(24),
  },
  circle: {
    width: rS(92),
    height: rS(92),
    borderRadius: rS(46),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rS(18),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: mS(18),
    fontWeight: "700",
    textAlign: "center",
  },
  msg: {
    fontSize: mS(14),
    textAlign: "center",
    marginTop: rS(10),
    lineHeight: mS(21),
    maxWidth: rS(280),
  },
});
