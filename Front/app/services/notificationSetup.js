/**
 * Push Notifications setup for MyTIU.
 *
 * Uses expo-notifications with Firebase Cloud Messaging (Android) via google-services.json.
 * Architecture:
 *   Device → FCM/Expo token → Backend → Firebase Admin / Expo Push API → Device (even when closed)
 */
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

// ─── Foreground notification behaviour ────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Permission + Tokens ────────────────────────────────────────────────────────

/**
 * Request notification permissions and return all push tokens for this device.
 * Returns native FCM token (for Firebase) and Expo push token (fallback).
 *
 * @returns {Promise<string[]>}
 */
export async function registerForPushNotificationsAsync() {
  // Push is not supported on web — use a physical phone with Expo Go or a dev build.
  if (Platform.OS === "web") {
    if (__DEV__) {
      console.warn("[Notifications] Push is not available on web. Use Expo Go on a phone.");
    }
    return [];
  }

  if (!Device.isDevice) {
    if (__DEV__) {
      console.warn(
        "[Notifications] Push notifications require a physical device.",
      );
    }
    return [];
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#720E3D",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    if (__DEV__) {
      console.warn("[Notifications] Permission not granted.");
    }
    return [];
  }

  const tokens = [];

  // Expo push token — works without your own Firebase project (Expo Go or EAS + FCM)
  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    if (tokenData?.data) {
      tokens.push(tokenData.data);
      if (__DEV__) {
        console.log("[Notifications] Expo push token:", tokenData.data.substring(0, 40) + "...");
      }
    }
  } catch (err) {
    if (__DEV__) {
      console.warn("[Notifications] Expo push token failed:", err?.message);
    }
  }

  // Native FCM token — only when you add google-services.json + Back/.env Firebase vars
  if (process.env.EXPO_PUBLIC_ENABLE_FCM === "true") {
    try {
      const native = await Notifications.getDevicePushTokenAsync();
      if (native?.data) {
        tokens.push(native.data);
        if (__DEV__) {
          console.log("[Notifications] Native push token:", native.data.substring(0, 24) + "...");
        }
      }
    } catch (err) {
      if (__DEV__) {
        console.warn("[Notifications] Native FCM token failed:", err?.message);
      }
    }
  }

  return [...new Set(tokens)];
}

// ─── Listeners ────────────────────────────────────────────────────────────────

/**
 * Add a listener for notifications received while the app is in the foreground.
 *
 * @param {function} handler - Called with the Notification object
 * @returns {Subscription} Call .remove() to unsubscribe
 */
export function addForegroundNotificationListener(handler) {
  return Notifications.addNotificationReceivedListener(handler);
}

/**
 * Add a listener for when the user taps a notification
 * (works in background AND when app was terminated).
 *
 * @param {function} handler - Called with the NotificationResponse object
 * @returns {Subscription} Call .remove() to unsubscribe
 */
export function addNotificationResponseListener(handler) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

/**
 * Get the initial notification that caused the app to open from a terminated state.
 * Returns null if the app was opened normally.
 *
 * @returns {Promise<NotificationResponse|null>}
 */
export async function getInitialNotification() {
  return Notifications.getLastNotificationResponseAsync();
}

// ─── Badge ────────────────────────────────────────────────────────────────────

/**
 * Set the app badge count.
 * @param {number} count
 */
export async function setBadgeCount(count) {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (err) {
    if (__DEV__) console.warn("[Notifications] setBadgeCount failed:", err?.message);
  }
}

/**
 * Clear the app badge (set to 0).
 */
export async function clearBadge() {
  await setBadgeCount(0);
}

// ─── Platform helpers ─────────────────────────────────────────────────────────

/**
 * Get the current platform string for device token registration.
 * @returns {"android"|"ios"|"web"}
 */
export function getDevicePlatform() {
  return Platform.OS;
}
