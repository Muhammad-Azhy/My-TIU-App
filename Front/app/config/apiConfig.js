import { Platform } from "react-native";
import Constants from "expo-constants";

const API_PORT = String(process.env.EXPO_PUBLIC_API_PORT || "3000").trim();
const API_SUFFIX = "/api";

export function normalizeApiBase(url) {
  if (!url || typeof url !== "string") return null;
  let base = url.trim().replace(/\/+$/, "");
  if (!base.endsWith(API_SUFFIX)) {
    base = `${base}${API_SUFFIX}`;
  }
  return base;
}

function buildApiBase(host) {
  return `http://${host}:${API_PORT}${API_SUFFIX}`;
}

function isTunnelOrProxyHost(host) {
  if (!host) return false;
  const h = host.toLowerCase();
  return (
    h.includes("exp.direct") ||
    h.includes("ngrok") ||
    h.includes("trycloudflare") ||
    h.endsWith(".exp.host")
  );
}

function isPrivateLanHost(host) {
  if (!host) return false;
  return (
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host)
  );
}

function getExpoLanHost() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoGo?.debuggerHost,
    Constants.manifest?.debuggerHost,
  ];

  for (const value of candidates) {
    if (!value || typeof value !== "string") continue;
    const withoutScheme = value.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
    const host = withoutScheme.split(/[:/]/)[0];
    if (host && !isTunnelOrProxyHost(host) && isPrivateLanHost(host)) {
      return host;
    }
  }
  return null;
}

function isAndroidEmulator() {
  return Platform.OS === "android" && Constants.isDevice === false;
}

function isIosSimulator() {
  return Platform.OS === "ios" && Constants.isDevice === false;
}

function isPhysicalDevice() {
  return Constants.isDevice === true;
}

/**
 * Resolves REST API base URL. Never uses Expo tunnel hosts for API.
 * Physical phones: EXPO_PUBLIC_API_BASE_URL_DEVICE (your PC LAN IP) is primary.
 */
export function resolveApiBaseUrl() {
  const override = normalizeApiBase(process.env.EXPO_PUBLIC_API_BASE_URL);
  const fromEnv = {
    web: normalizeApiBase(process.env.EXPO_PUBLIC_API_BASE_URL_WEB),
    android: normalizeApiBase(process.env.EXPO_PUBLIC_API_BASE_URL_ANDROID),
    device: normalizeApiBase(process.env.EXPO_PUBLIC_API_BASE_URL_DEVICE),
  };

  if (Platform.OS === "web") {
    return override || fromEnv.web || buildApiBase("localhost");
  }

  if (override) {
    return override;
  }

  if (isAndroidEmulator()) {
    return fromEnv.android || buildApiBase("10.0.2.2");
  }

  if (isIosSimulator()) {
    return fromEnv.web || buildApiBase("localhost");
  }

  if (isPhysicalDevice()) {
    if (fromEnv.device) {
      return fromEnv.device;
    }
    const lanHost = getExpoLanHost();
    if (lanHost) {
      return buildApiBase(lanHost);
    }
    if (Platform.OS === "android" && fromEnv.android) {
      return fromEnv.android;
    }
  }

  const lanHost = getExpoLanHost();
  if (lanHost) {
    return buildApiBase(lanHost);
  }

  if (fromEnv.device) {
    return fromEnv.device;
  }

  if (Platform.OS === "android") {
    return fromEnv.android || buildApiBase("10.0.2.2");
  }

  return fromEnv.web || buildApiBase("localhost");
}

export function getUploadsBaseUrl() {
  return resolveApiBaseUrl().replace(/\/api$/, "");
}

export function getApiConfigDebugInfo() {
  return {
    platform: Platform.OS,
    isDevice: Constants.isDevice,
    isPhysicalDevice: isPhysicalDevice(),
    expoLanHost: getExpoLanHost(),
    resolved: resolveApiBaseUrl(),
    env: {
      override: process.env.EXPO_PUBLIC_API_BASE_URL || null,
      web: process.env.EXPO_PUBLIC_API_BASE_URL_WEB || null,
      android: process.env.EXPO_PUBLIC_API_BASE_URL_ANDROID || null,
      device: process.env.EXPO_PUBLIC_API_BASE_URL_DEVICE || null,
    },
  };
}
