import React from "react";
import { View, StyleSheet } from "react-native";
import { rS } from "../../Styles/responsive";
import PressableScale from "../animations/PressableScale";

export default function AppCard({
  children,
  theme,
  onPress,
  style,
  elevated = true,
}) {
  const base = [
    styles.card,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
      ...(elevated ? styles.shadow : {}),
    },
    style,
  ];

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={base}>
        {children}
      </PressableScale>
    );
  }

  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: rS(14),
    borderWidth: StyleSheet.hairlineWidth,
    padding: rS(14),
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
