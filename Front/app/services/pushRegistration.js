import { notificationsApi } from "./api";
import { registerForPushNotificationsAsync, getDevicePlatform } from "./notificationSetup";
import { savePushTokens, readPushTokens, clearPushTokens } from "./pushTokenStorage";

/**
 * Register FCM + Expo push tokens with the backend after login.
 */
export async function registerPushTokensWithBackend() {
  const tokens = await registerForPushNotificationsAsync();
  if (!tokens.length) {
    if (__DEV__) {
      console.warn(
        "[Push] No push token obtained. Use a physical phone, allow notifications, " +
          "and avoid the web build (npm run web).",
      );
    }
    return;
  }

  await savePushTokens(tokens);
  const platform = getDevicePlatform();

  await Promise.all(
    tokens.map((token) => notificationsApi.registerToken({ token, platform })),
  );

  console.log(`[Push] Registered ${tokens.length} token(s) with backend`);
}

/**
 * Remove stored push tokens from the backend (call on logout).
 */
export async function unregisterPushTokensFromBackend() {
  const tokens = await readPushTokens();
  await Promise.all(
    tokens.map((token) => notificationsApi.removeToken(token).catch(() => {})),
  );
  await clearPushTokens();
}
