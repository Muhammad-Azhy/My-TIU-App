import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./Redux/Store/storeConfig";
import Login from "./Pages/Guests/Login";
import RootNavigator from "./Navigation/RootNavigator";
import { mS } from "./Styles/responsive";
import { readAuth } from "./services/authStorage";
import { setApiToken } from "./services/api";
import { setUser } from "./Redux/Slices/User/userSlice";

// ✅ Theme wrapper component
const MainApp = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.role);
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const bootstrapAuth = async () => {
      console.log("[AUTH] bootstrap start");
      const saved = await readAuth();
      console.log("[AUTH] bootstrap loaded", {
        hasToken: Boolean(saved?.token),
        hasUser: Boolean(saved?.user),
      });
      if (saved?.token && saved?.user) {
        setApiToken(saved.token);
        dispatch(setUser({ token: saved.token, user: saved.user }));
        console.log("[AUTH] bootstrap restored session");
      }
    };
    bootstrapAuth();
  }, [dispatch]);

  // console.log("User Role:", userRole);
  // console.log("Theme Mode:", mode);

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
