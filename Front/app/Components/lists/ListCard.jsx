import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { rS, mS } from "../../Styles/responsive";

/**
 * Simple list row for courses, announcements, etc.
 */
export default function ListCard({
  title,
  subtitle,
  meta,
  onPress,
  theme,
  icon = "chevron-right",
}) {
  const content = (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
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
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: rS(14),
    borderRadius: rS(12),
    marginBottom: rS(10),
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
  },
  meta: {
    fontSize: mS(12),
    marginTop: rS(6),
  },
});
