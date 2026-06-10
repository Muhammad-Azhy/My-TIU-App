import React from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import Login from "./Pages/Guests/Login";
import RootNavigator from "./Navigation/RootNavigator";
import { mS } from "./Styles/responsive";

const SwitchLog = () => {
  const userRole = useSelector((state) => state.user.userRole);

  if (!userRole) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Login />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: mS(1) }}>
      <RootNavigator />
    </SafeAreaView>
  );
};

export default SwitchLog;
