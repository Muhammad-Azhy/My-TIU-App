import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { rS, mS } from "../../Styles/responsive";

export default function EmptyState({ icon = "inbox", title, message, theme }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: theme.secondary }]}>
        <Icon name={icon} size={mS(40)} color={theme.subText} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {message ? (
        <Text style={[styles.msg, { color: theme.subText }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: rS(32),
    paddingHorizontal: rS(20),
  },
  circle: {
    width: rS(88),
    height: rS(88),
    borderRadius: rS(44),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rS(16),
  },
  title: {
    fontSize: mS(18),
    fontWeight: "700",
    textAlign: "center",
  },
  msg: {
    fontSize: mS(14),
    textAlign: "center",
    marginTop: rS(8),
    lineHeight: mS(20),
  },
});
