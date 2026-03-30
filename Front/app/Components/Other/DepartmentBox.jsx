import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { mS, rS } from "../../Styles/responsive";
import { useNavigation } from "@react-navigation/native";
import useTheme from "../../Hooks/useTheme";

const DepartmentBox = ({ dept }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const bgColor = theme.mode === "dark" ? dept["dark-color"] : dept["light-color"];

  return (
    <Pressable
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={() => navigation.navigate("DepartmentDetails", { dept })}
    >
      <MaterialIcons name={dept.icon} size={mS(32)} color="#fff" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{dept.name}</Text>
      </View>
      <MaterialIcons
        name="arrow-forward-ios"
        size={mS(20)}
        color="rgba(255,255,255,0.8)"
      />
    </Pressable>
  );
};

export default DepartmentBox;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: rS(15),
    borderRadius: rS(10),
    marginVertical: rS(6),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textContainer: {
    marginLeft: rS(12),
    flex: 1,
  },
  title: {
    fontSize: rS(18),
    fontWeight: "bold",
    color: "#fff",
  },
});