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
import { store } from "./Redux/Store/storeConfig";
import Login from "./Pages/Guests/Login";
import RootNavigator from "./Navigation/RootNavigator";
import { readAuth } from "./services/authStorage";
import { setApiToken, notificationsApi } from "./services/api";
import { setUser } from "./Redux/Slices/User/userSlice";
import { fetchUserProfile } from "./Redux/Slices/User/userAction";
import { fetchUnreadCount } from "./Redux/Slices/Notifications/notificationsAction";
import { darkTheme, lightTheme } from "./Styles/theme";
import {
  requestNotificationPermission,
  getFCMToken,
  onForegroundMessage,
  onTokenRefresh,
  isFirebaseAvailable,
  getDevicePlatform,
} from "./services/notificationSetup";

/**
 * Register FCM token with the backend after login.
 */
async function registerPushToken() {
  if (!isFirebaseAvailable()) return;

  const granted = await requestNotificationPermission();
  if (!granted) {
    if (__DEV__) console.log("[Push] Notification permission denied");
    return;
  }

  const fcmToken = await getFCMToken();
  if (fcmToken) {
    try {
      await notificationsApi.registerToken({
        token: fcmToken,
        platform: getDevicePlatform(),
      });
      if (__DEV__) console.log("[Push] Token registered with backend");
    } catch (err) {
      if (__DEV__) console.warn("[Push] Token registration failed:", err?.message);
    }
  }
}

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

  // Set up push notifications when authenticated
  useEffect(() => {
    if (!userRole || userRole === "guest") return;

    // Register push token
    registerPushToken();

    // Listen for token refresh
    const unsubTokenRefresh = onTokenRefresh(async (newToken) => {
      if (newToken) {
        try {
          await notificationsApi.registerToken({
            token: newToken,
            platform: getDevicePlatform(),
          });
        } catch (err) {
          if (__DEV__) console.warn("[Push] Token refresh registration failed:", err?.message);
        }
      }
    });

    // Listen for foreground messages
    const unsubForeground = onForegroundMessage((remoteMessage) => {
      if (__DEV__) {
        console.log("[Push] Foreground message:", remoteMessage?.notification?.title);
      }
      // Refresh unread count when a push arrives
      dispatch(fetchUnreadCount());

      // Show an in-app alert for foreground messages
      const title = remoteMessage?.notification?.title || "Notification";
      const body = remoteMessage?.notification?.body || "";
      Alert.alert(title, body);
    });

    return () => {
      if (typeof unsubTokenRefresh === "function") unsubTokenRefresh();
      if (typeof unsubForeground === "function") unsubForeground();
    };
  }, [userRole, dispatch]);

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
