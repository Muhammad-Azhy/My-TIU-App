import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Returns the base URL for serving uploaded files (e.g. /uploads/...).
 * Mirrors the same logic used for the API base URL but strips the /api suffix.
 */
function resolveUploadsBase() {
  const WEB_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_WEB;
  const ANDROID_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_ANDROID;
  const DEVICE_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_DEVICE;

  let base;

  if (Platform.OS === "web") {
    base = WEB_BASE || "http://localhost:3000/api";
  } else if (Platform.OS === "android") {
    // Prefer explicit DEVICE_BASE, then try auto-detect from Expo dev server
    if (DEVICE_BASE) {
      base = DEVICE_BASE;
    } else {
      const hostUri = Constants.expoConfig?.hostUri;
      if (hostUri) {
        const lanIp = hostUri.split(":")[0];
        base = `http://${lanIp}:3000/api`;
      } else {
        base = ANDROID_BASE || "http://10.0.2.2:3000/api";
      }
    }
  } else {
    // iOS / other
    if (DEVICE_BASE) {
      base = DEVICE_BASE;
    } else {
      const hostUri = Constants.expoConfig?.hostUri;
      if (hostUri) {
        const lanIp = hostUri.split(":")[0];
        base = `http://${lanIp}:3000/api`;
      } else {
        base = WEB_BASE || "http://localhost:3000/api";
      }
    }
  }

  // Strip /api suffix — uploads are served from /uploads/ on the root
  return base.replace(/\/api\/?$/, "");
}

export const UPLOADS_BASE = resolveUploadsBase();
