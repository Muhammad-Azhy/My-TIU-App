import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import useTheme from "../../Hooks/useTheme";
import { mS, rS, vS } from "../../Styles/responsive";

/**
 * A themed back-arrow bar.  Drop it at the top of any sub-page.
 *
 *   <BackBar title="Announcements" />
 *
 * Uses navigation.goBack() by default; pass `onPress` to override.
 */
export default function BackBar({ title, onPress }) {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={[styles.bar, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={styles.btn}
        onPress={onPress || (() => navigation.goBack())}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon name="arrow-back" size={mS(22)} color={theme.text} />
      </TouchableOpacity>
      {title ? (
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rS(8),
    paddingVertical: vS(10),
    gap: rS(8),
  },
  btn: {
    padding: rS(6),
    borderRadius: rS(8),
  },
  title: {
    fontSize: mS(18),
    fontWeight: "700",
    flex: 1,
  },
});
