import React from "react";
import { SafeAreaView } from "react-native";
import { Provider, useSelector } from "react-redux";
import { store } from "./Redux/Store/storeConfig";
import Login from "./Pages/Guests/Login";
import RootNavigator from "./Navigation/RootNavigator";
import { mS } from "./Styles/responsive";

const MainApp = () => {
  const userRole = useSelector((state) => state.user.role);
  console.log(userRole);

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

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
