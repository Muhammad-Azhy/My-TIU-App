import admin from "firebase-admin";
import prisma from "../prisma/prismaClient.js";

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK.
 * Looks for GOOGLE_APPLICATION_CREDENTIALS env var or a service-account.json
 * in the project root. If neither exists, FCM push is disabled gracefully.
 */
export function initializeFirebase() {
  if (firebaseInitialized) return;

  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      firebaseInitialized = true;
      console.log("[FCM] Firebase Admin initialized via GOOGLE_APPLICATION_CREDENTIALS");
    } else {
      console.warn(
        "[FCM] Firebase not configured. Set GOOGLE_APPLICATION_CREDENTIALS in .env " +
        "to enable push notifications. In-app notifications still work."
      );
    }
  } catch (err) {
    console.warn("[FCM] Firebase initialization failed:", err.message);
  }
}

/**
 * Send a push notification to specific FCM tokens.
 * @param {string[]} tokens - FCM device tokens
 * @param {{ title: string, body?: string, data?: object }} payload
 */
export async function sendPushToTokens(tokens, { title, body, data }) {
  if (!firebaseInitialized || !tokens.length) return;

  const message = {
    notification: { title, body: body || "" },
    data: data ? Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ) : undefined,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      ...message,
    });

    // Clean up invalid tokens
    if (response.responses) {
      const invalidTokens = [];
      response.responses.forEach((resp, idx) => {
        if (
          !resp.success &&
          resp.error &&
          (resp.error.code === "messaging/registration-token-not-registered" ||
           resp.error.code === "messaging/invalid-registration-token")
        ) {
          invalidTokens.push(tokens[idx]);
        }
      });

      if (invalidTokens.length) {
        await prisma.deviceToken.deleteMany({
          where: { token: { in: invalidTokens } },
        }).catch((e) => console.error("[FCM] cleanup failed", e));
      }
    }

    if (__DEV_LOG__) {
      console.log(`[FCM] Sent to ${response.successCount}/${tokens.length} devices`);
    }
  } catch (err) {
    console.error("[FCM] sendPushToTokens failed:", err.message);
  }
}

// Simple flag for verbose logging in development
const __DEV_LOG__ = process.env.NODE_ENV !== "production";

/**
 * Send push notification to all registered devices of specific users.
 * @param {number[]} userIds
 * @param {{ title: string, body?: string, data?: object }} payload
 */
export async function sendPushToUsers(userIds, payload) {
  if (!firebaseInitialized || !userIds.length) return;

  try {
    const deviceTokens = await prisma.deviceToken.findMany({
      where: { userId: { in: userIds } },
      select: { token: true },
    });

    const tokens = deviceTokens.map((dt) => dt.token).filter(Boolean);
    if (tokens.length) {
      await sendPushToTokens(tokens, payload);
    }
  } catch (err) {
    console.error("[FCM] sendPushToUsers failed:", err.message);
  }
}
