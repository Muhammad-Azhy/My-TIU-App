import admin from "firebase-admin";
import prisma from "../prisma/prismaClient.js";

let initialized = false;

/**
 * Initialize Firebase Admin from env vars.
 * Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in Back/.env
 */
export function initFirebase() {
  if (initialized) return true;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return false;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
  initialized = true;
  return true;
}

export function isFirebaseConfigured() {
  return initFirebase();
}

/**
 * Native FCM/APNs device tokens (not Expo push tokens).
 */
export function isFcmToken(token) {
  return (
    typeof token === "string" &&
    token.length > 20 &&
    !token.startsWith("ExponentPushToken[") &&
    !token.startsWith("ExpoPushToken[")
  );
}

/**
 * Send push notifications via Firebase Cloud Messaging.
 * Works when the app is closed or in the background (OS-delivered alerts).
 */
export async function sendFcmToTokens(tokens, { title, body, data }) {
  if (!initFirebase()) return { sent: 0, failed: 0 };

  const validTokens = tokens.filter(isFcmToken);
  if (!validTokens.length) return { sent: 0, failed: 0 };

  const payload = {
    notification: { title, body: body || "" },
    data: Object.fromEntries(
      Object.entries(data || {}).map(([k, v]) => [k, String(v ?? "")]),
    ),
    android: {
      priority: "high",
      notification: {
        channelId: "default",
        sound: "default",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
  };

  let sent = 0;
  let failed = 0;
  const invalidTokens = [];

  // FCM limits multicast to 500 tokens; batch in chunks of 100 for safety.
  for (let i = 0; i < validTokens.length; i += 100) {
    const chunk = validTokens.slice(i, i + 100);
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: chunk,
        ...payload,
      });

      sent += response.successCount;
      failed += response.failureCount;

      response.responses.forEach((result, idx) => {
        if (result.success) return;
        const code = result.error?.code;
        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token"
        ) {
          invalidTokens.push(chunk[idx]);
        } else {
          console.warn("[FCM] send error:", code, result.error?.message);
        }
      });
    } catch (err) {
      console.error("[FCM] sendEachForMulticast failed:", err.message);
      failed += chunk.length;
    }
  }

  if (invalidTokens.length) {
    await prisma.deviceToken
      .deleteMany({ where: { token: { in: invalidTokens } } })
      .catch((e) => console.error("[FCM] token cleanup failed:", e.message));
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[FCM] Sent ${sent}/${validTokens.length} (${failed} failed)`);
  }

  return { sent, failed };
}
