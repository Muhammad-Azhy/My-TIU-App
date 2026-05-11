import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { rS, mS } from "../../Styles/responsive";

export default function PageHeader({ title, subtitle, theme }) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.sub, { color: theme.subText }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: rS(4),
    marginBottom: rS(14),
  },
  title: {
    fontSize: mS(26),
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: mS(14),
    marginTop: rS(6),
    lineHeight: mS(20),
  },
});
