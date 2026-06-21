import prisma from "../prisma/prismaClient.js";
import { sendPushToTokens, isValidExpoToken } from "./expoService.js";
import { sendFcmToTokens, isFcmToken, isFirebaseConfigured } from "./fcmService.js";

/**
 * Send push notifications to all registered devices for specific users.
 * Routes tokens to Firebase (FCM) or Expo Push based on token format.
 * Both channels deliver notifications when the app is closed.
 */
export async function sendPushToUsers(userIds, payload) {
  if (!userIds.length) return;

  try {
    const deviceTokens = await prisma.deviceToken.findMany({
      where: { userId: { in: userIds } },
      select: { token: true },
    });

    const tokens = deviceTokens.map((dt) => dt.token);
    const fcmTokens = tokens.filter(isFcmToken);
    const expoTokens = tokens.filter(isValidExpoToken);

    const tasks = [];

    if (fcmTokens.length && isFirebaseConfigured()) {
      tasks.push(sendFcmToTokens(fcmTokens, payload));
    }

    if (expoTokens.length) {
      tasks.push(sendPushToTokens(expoTokens, payload));
    }

    if (!tasks.length) {
      console.warn(
        `[Push] No device tokens for ${userIds.length} user(s). ` +
          "Recipients must log in on a phone and allow notifications.",
      );
    }

    await Promise.all(tasks);
  } catch (err) {
    console.error("[Push] sendPushToUsers failed:", err.message);
  }
}
