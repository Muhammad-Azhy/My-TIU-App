import React from "react";
import { SafeAreaView } from "react-native";
import { Provider, useSelector } from "react-redux";
import { store } from "./Redux/Store/storeConfig";
import Login from "./Pages/Guests/Login";
import RootNavigator from "./Navigation/RootNavigator";
import { mS } from "./Styles/responsive";

// ✅ Theme wrapper component
const MainApp = () => {
  const userRole = useSelector((state) => state.user.role);
  const mode = useSelector((state) => state.theme.mode);

  console.log("User Role:", userRole);
  console.log("Theme Mode:", mode);

  // Optional: use a dynamic theme background
  const backgroundColor = mode === "dark" ? "#121212" : "#eeeeee";

  if (!userRole) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <Login />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <RootNavigator />
    </SafeAreaView>
  );
};

// ✅ Wrap the entire app in Provider
const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
