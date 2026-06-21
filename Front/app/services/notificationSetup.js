import { Platform } from "react-native";

let messaging = null;
let firebaseAvailable = false;

// On web, Firebase messaging is not supported — all functions return graceful no-ops.
const IS_NATIVE = Platform.OS === "android" || Platform.OS === "ios";

/**
 * Lazy-load @react-native-firebase/messaging.
 * Only attempts import on native platforms (Android/iOS).
 * Returns null on web or when the package is not installed.
 */
function getMessaging() {
  if (messaging !== null) return messaging || null;
  if (!IS_NATIVE) {
    messaging = false;
    return null;
  }
  try {
    // Dynamic require wrapped in a function so Metro doesn't bundle it for web.
    // eslint-disable-next-line no-eval
    const mod = eval('require("@react-native-firebase/messaging")');
    messaging = mod.default || mod;
    firebaseAvailable = true;
    return messaging;
  } catch {
    messaging = false;
    console.warn(
      "[Notifications] @react-native-firebase/messaging not available. " +
      "Push notifications are disabled. Install the package and rebuild to enable."
    );
    return null;
  }
}

/**
 * Request notification permissions.
 * @returns {boolean} whether permission was granted
 */
export async function requestNotificationPermission() {
  const m = getMessaging();
  if (!m) return false;

  try {
    const authStatus = await m().requestPermission();
    const enabled =
      authStatus === m.AuthorizationStatus?.AUTHORIZED ||
      authStatus === m.AuthorizationStatus?.PROVISIONAL;

    if (__DEV__) {
      console.log("[Notifications] Permission status:", authStatus, "Enabled:", enabled);
    }
    return enabled;
  } catch (err) {
    console.warn("[Notifications] Permission request failed:", err?.message);
    return false;
  }
}

/**
 * Get the FCM device token.
 * @returns {string|null} the token, or null if unavailable
 */
export async function getFCMToken() {
  const m = getMessaging();
  if (!m) return null;

  try {
    const token = await m().getToken();
    if (__DEV__) {
      console.log("[Notifications] FCM Token:", token?.substring(0, 20) + "...");
    }
    return token || null;
  } catch (err) {
    console.warn("[Notifications] Failed to get FCM token:", err?.message);
    return null;
  }
}

/**
 * Set up foreground message handler.
 * @param {function} onMessage - called with the remote message object
 * @returns {function|null} unsubscribe function
 */
export function onForegroundMessage(onMessage) {
  const m = getMessaging();
  if (!m) return null;

  try {
    return m().onMessage(onMessage);
  } catch (err) {
    console.warn("[Notifications] Failed to set foreground handler:", err?.message);
    return null;
  }
}

/**
 * Set the background message handler.
 * Must be called at the top level (not inside a component).
 * @param {function} handler
 */
export function setBackgroundMessageHandler(handler) {
  const m = getMessaging();
  if (!m) return;

  try {
    m().setBackgroundMessageHandler(handler);
  } catch (err) {
    console.warn("[Notifications] Failed to set background handler:", err?.message);
  }
}

/**
 * Listen for token refresh events.
 * @param {function} onTokenRefresh - called with the new token string
 * @returns {function|null} unsubscribe function
 */
export function onTokenRefresh(callback) {
  const m = getMessaging();
  if (!m) return null;

  try {
    return m().onTokenRefresh(callback);
  } catch (err) {
    console.warn("[Notifications] Failed to set token refresh handler:", err?.message);
    return null;
  }
}

/**
 * Check if Firebase Messaging is available in this runtime.
 */
export function isFirebaseAvailable() {
  getMessaging(); // trigger lazy init
  return firebaseAvailable;
}

/**
 * Get the current platform string for device token registration.
 */
export function getDevicePlatform() {
  return Platform.OS; // "android", "ios", or "web"
}
