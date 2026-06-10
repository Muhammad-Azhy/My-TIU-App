import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  Animated,
  View,
  StyleSheet,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./Redux/Store/storeConfig";
import Login from "./Pages/Guests/Login";
import RootNavigator from "./Navigation/RootNavigator";
import { readAuth } from "./services/authStorage";
import { setApiToken } from "./services/api";
import { setUser } from "./Redux/Slices/User/userSlice";
import { darkTheme, lightTheme } from "./Styles/theme";

const MainApp = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.role);
  const mode = useSelector((state) => state.theme.mode);
  const [authReady, setAuthReady] = useState(false);
  const screenOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const saved = await readAuth();
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log("[AUTH] bootstrap", {
            hasToken: Boolean(saved?.token),
            hasUser: Boolean(saved?.user),
          });
        }
        if (saved?.token && saved?.user) {
          setApiToken(saved.token);
          dispatch(setUser({ token: saved.token, user: saved.user }));
        }
      } catch (e) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn("[AUTH] bootstrap failed", e?.message);
        }
      } finally {
        setAuthReady(true);
      }
    };
    bootstrapAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!authReady) return;
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [authReady, screenOpacity]);

  const theme = mode === "dark" ? darkTheme : lightTheme;
  const backgroundColor = mode === "dark" ? "#121212" : "#eeeeee";

  if (!authReady) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (!userRole) {
    return (
      <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <Login />
        </SafeAreaView>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <RootNavigator />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
