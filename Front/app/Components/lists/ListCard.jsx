import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { rS, mS } from "../../Styles/responsive";
import PressableScale from "../animations/PressableScale";

export default function ListCard({
  title,
  subtitle,
  meta,
  onPress,
  theme,
  icon = "chevron-right",
}) {
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: theme.subText }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <Text style={[styles.meta, { color: theme.subText }]}>{meta}</Text>
        ) : null}
      </View>
      {onPress ? (
        <Icon name={icon} size={mS(22)} color={theme.subText} />
      ) : null}
    </View>
  );

  if (onPress) {
    return <PressableScale onPress={onPress}>{content}</PressableScale>;
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: rS(14),
    borderRadius: rS(14),
    marginBottom: rS(10),
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  textWrap: {
    flex: 1,
    paddingRight: rS(8),
  },
  title: {
    fontSize: mS(16),
    fontWeight: "600",
  },
  subtitle: {
    fontSize: mS(14),
    marginTop: rS(4),
    lineHeight: mS(20),
  },
  meta: {
    fontSize: mS(12),
    marginTop: rS(6),
    fontWeight: "600",
  },
});
