import prisma from "../prisma/prismaClient.js";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_CHUNK_SIZE = 100; // Expo's limit per request

/**
 * Split an array into chunks of a given size.
 */
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Check if a token looks like a valid Expo push token.
 */
export function isValidExpoToken(token) {
  return (
    typeof token === "string" &&
    (token.startsWith("ExponentPushToken[") || token.startsWith("ExpoPushToken["))
  );
}

/**
 * Send push notifications to a list of Expo push tokens.
 * Handles batching (100 tokens max per Expo request).
 *
 * @param {string[]} tokens - Expo push tokens
 * @param {{ title: string, body?: string, data?: object, sound?: string }} payload
 */
export async function sendPushToTokens(tokens, { title, body, data, sound = "default" }) {
  const validTokens = tokens.filter(isValidExpoToken);
  if (!validTokens.length) return;

  const chunks = chunkArray(validTokens, EXPO_CHUNK_SIZE);

  for (const chunk of chunks) {
    const messages = chunk.map((token) => ({
      to: token,
      title,
      body: body || "",
      data: data || {},
      sound,
      priority: "high",
      channelId: "default",
    }));

    try {
      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`[Expo Push] HTTP error ${response.status}:`, text);
        continue;
      }

      const result = await response.json();

      // Check for per-token errors and clean up invalid tokens
      if (Array.isArray(result.data)) {
        const invalidTokens = [];
        result.data.forEach((ticket, idx) => {
          if (ticket.status === "error") {
            console.warn("[Expo Push] Ticket error:", ticket.message, "details:", ticket.details);
            // DeviceNotRegistered means the token is no longer valid
            if (ticket.details?.error === "DeviceNotRegistered") {
              invalidTokens.push(chunk[idx]);
            }
          }
        });

        if (invalidTokens.length) {
          await prisma.deviceToken
            .deleteMany({ where: { token: { in: invalidTokens } } })
            .catch((e) => console.error("[Expo Push] cleanup failed:", e.message));
          if (__DEV_LOG__) {
            console.log(`[Expo Push] Cleaned ${invalidTokens.length} invalid tokens`);
          }
        }
      }

      if (__DEV_LOG__) {
        const ok = result.data?.filter((t) => t.status === "ok").length ?? 0;
        console.log(`[Expo Push] Sent ${ok}/${chunk.length} successfully`);
      }
    } catch (err) {
      console.error("[Expo Push] sendPushToTokens failed:", err.message);
    }
  }
}

// Verbose logging only in development
const __DEV_LOG__ = process.env.NODE_ENV !== "production";

/**
 * Send push notification to all registered devices for specific users.
 * Fetches tokens from DB, then sends via Expo Push API.
 *
 * @param {number[]} userIds
 * @param {{ title: string, body?: string, data?: object }} payload
 */
export async function sendPushToUsers(userIds, payload) {
  if (!userIds.length) return;

  try {
    const deviceTokens = await prisma.deviceToken.findMany({
      where: { userId: { in: userIds } },
      select: { token: true },
    });

    const tokens = deviceTokens.map((dt) => dt.token).filter(isValidExpoToken);
    if (tokens.length) {
      await sendPushToTokens(tokens, payload);
    } else if (__DEV_LOG__) {
      console.log("[Expo Push] No valid tokens found for users:", userIds);
    }
  } catch (err) {
    console.error("[Expo Push] sendPushToUsers failed:", err.message);
  }
}
