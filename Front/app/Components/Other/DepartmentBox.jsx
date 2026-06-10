import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { mS, rS } from "../../Styles/responsive";
import { useNavigation } from "@react-navigation/native";
import useTheme from "../../Hooks/useTheme";
import PressableScale from "../animations/PressableScale";

const DepartmentBox = ({ dept }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const bgColor =
    theme.mode === "dark" ? dept["dark-color"] : dept["light-color"];

  return (
    <PressableScale
      onPress={() => navigation.navigate("DepartmentDetails", { dept })}
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          shadowColor: bgColor,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialIcons name={dept.icon} size={mS(28)} color="#fff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {dept.name}
        </Text>
        {dept.code ? (
          <Text style={styles.code}>{dept.code}</Text>
        ) : null}
      </View>
      <MaterialIcons
        name="arrow-forward-ios"
        size={mS(18)}
        color="rgba(255,255,255,0.85)"
      />
    </PressableScale>
  );
};

export default DepartmentBox;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: rS(14),
    borderRadius: rS(12),
    marginVertical: rS(5),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: rS(44),
    height: rS(44),
    borderRadius: rS(10),
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginLeft: rS(12),
    flex: 1,
    paddingRight: rS(8),
  },
  title: {
    fontSize: rS(16),
    fontWeight: "700",
    color: "#fff",
    lineHeight: rS(22),
  },
  code: {
    fontSize: rS(12),
    color: "rgba(255,255,255,0.8)",
    marginTop: rS(2),
    fontWeight: "600",
  },
});
