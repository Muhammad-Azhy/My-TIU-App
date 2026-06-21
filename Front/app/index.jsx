import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  Animated,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./Redux/Store/storeConfig";
import Login from "./Pages/Guests/Login";
import RootNavigator from "./Navigation/RootNavigator";
import { readAuth } from "./services/authStorage";
import { setApiToken } from "./services/api";
import { setUser } from "./Redux/Slices/User/userSlice";
import { fetchUserProfile } from "./Redux/Slices/User/userAction";
import { fetchUnreadCount } from "./Redux/Slices/Notifications/notificationsAction";
import { darkTheme, lightTheme } from "./Styles/theme";
import {
  addForegroundNotificationListener,
  addNotificationResponseListener,
  getInitialNotification,
  setBadgeCount,
} from "./services/notificationSetup";
import { registerPushTokensWithBackend } from "./services/pushRegistration";

async function registerPushToken() {
  try {
    await registerPushTokensWithBackend();
  } catch (err) {
    if (__DEV__) console.warn("[Push] Token registration failed:", err?.message);
  }
}

const MainApp = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.role);
  const mode = useSelector((state) => state.theme.mode);
  const unreadCount = useSelector((s) => s.notifications.unreadCount);
  const [authReady, setAuthReady] = useState(false);
  const screenOpacity = useRef(new Animated.Value(0)).current;

  // ── Bootstrap: restore session from storage ──────────────────────────────
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

          // Fetch enriched profile (with department, gpa, semester)
          dispatch(fetchUserProfile());
          // Fetch unread notification count
          dispatch(fetchUnreadCount());
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

  // ── Push notifications setup when authenticated ───────────────────────────
  useEffect(() => {
    if (!userRole || userRole === "guest") return;

    // Register Expo push token with backend
    registerPushToken();

    // Handle initial notification (app opened from terminated state by tapping a notification)
    getInitialNotification()
      .then((response) => {
        if (response) {
          if (__DEV__) {
            console.log(
              "[Push] App opened via notification:",
              response.notification?.request?.content?.title,
            );
          }
          // Refresh unread count — navigation handled by Notifications screen
          dispatch(fetchUnreadCount());
        }
      })
      .catch(() => {});

    // Foreground: show in-app alert and refresh badge
    const foregroundSub = addForegroundNotificationListener((notification) => {
      if (__DEV__) {
        console.log(
          "[Push] Foreground notification:",
          notification?.request?.content?.title,
        );
      }
      dispatch(fetchUnreadCount());

      const title = notification?.request?.content?.title || "Notification";
      const body = notification?.request?.content?.body || "";
      Alert.alert(title, body);
    });

    // Background / Terminated tap: update badge count
    const responseSub = addNotificationResponseListener((response) => {
      if (__DEV__) {
        console.log(
          "[Push] Notification tapped:",
          response?.notification?.request?.content?.title,
        );
      }
      dispatch(fetchUnreadCount());
    });

    return () => {
      foregroundSub?.remove?.();
      responseSub?.remove?.();
    };
  }, [userRole, dispatch]);

  // ── Sync badge count with Redux unread count ──────────────────────────────
  useEffect(() => {
    setBadgeCount(unreadCount ?? 0).catch(() => {});
  }, [unreadCount]);

  // ── Fade-in animation after auth check ───────────────────────────────────
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
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
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
