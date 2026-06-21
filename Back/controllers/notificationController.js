import prisma from "../prisma/prismaClient.js";
import {
  notifyUsers,
  getAllStudentUserIds,
  getAllLecturerUserIds,
  getAllActiveUserIds,
} from "../services/notificationService.js";

export const listNotifications = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, readAt: null },
    });
    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error("[notifications] list", err);
    res.status(500).json({ message: "Failed to load notifications." });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, readAt: null },
    });
    res.json({ unreadCount });
  } catch (err) {
    console.error("[notifications] unread count", err);
    res.status(500).json({ message: "Failed to load unread count." });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.notification.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ message: "Notification not found." });
    }
    const updated = await prisma.notification.update({
      where: { id },
      data: { readAt: existing.readAt || new Date() },
    });
    res.json(updated);
  } catch (err) {
    console.error("[notifications] mark read", err);
    res.status(500).json({ message: "Failed to mark notification as read." });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, readAt: null },
      data: { readAt: new Date() },
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("[notifications] mark all read", err);
    res.status(500).json({ message: "Failed to mark all as read." });
  }
};

/**
 * Register or update a device token for push notifications.
 * POST /notifications/device-token  body: { token, platform }
 */
export const registerDeviceToken = async (req, res) => {
  try {
    const { token, platform } = req.body;
    if (!token) {
      return res.status(400).json({ message: "token is required" });
    }

    const deviceToken = await prisma.deviceToken.upsert({
      where: {
        userId_token: {
          userId: req.user.id,
          token,
        },
      },
      create: {
        userId: req.user.id,
        token,
        platform: platform || null,
      },
      update: {
        platform: platform || undefined,
        updatedAt: new Date(),
      },
    });

    res.json(deviceToken);
    console.log(`[Push] Token registered for user ${req.user.id} (${platform || "unknown"})`);
  } catch (err) {
    console.error("[notifications] registerDeviceToken", err);
    res.status(500).json({ message: "Failed to register device token." });
  }
};

/**
 * Remove a device token (on logout).
 * DELETE /notifications/device-token  body: { token }
 */
export const removeDeviceToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "token is required" });
    }

    await prisma.deviceToken.deleteMany({
      where: {
        userId: req.user.id,
        token,
      },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("[notifications] removeDeviceToken", err);
    res.status(500).json({ message: "Failed to remove device token." });
  }
};

/**
 * Send a notification to a specific user or role group.
 * POST /notifications/send  (Admin/Lecturer only)
 * body: { type, title, body, userId?, targetRole?, entityType?, entityId? }
 *
 * targetRole options: "STUDENT" | "LECTURER" | "ADMIN" | "ALL"
 */
export const sendNotification = async (req, res) => {
  try {
    const {
      type = "ANNOUNCEMENT",
      title,
      body,
      userId,
      targetRole,
      entityType,
      entityId,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const validTypes = ["ASSIGNMENT", "ANNOUNCEMENT", "GRADE", "NEWS", "ENROLLMENT", "CLASS_ASSIGNMENT"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `type must be one of: ${validTypes.join(", ")}` });
    }

    let userIds = [];

    if (userId) {
      // Target a specific user
      userIds = [Number(userId)];
    } else if (targetRole) {
      switch (targetRole.toUpperCase()) {
        case "STUDENT":
          userIds = await getAllStudentUserIds();
          break;
        case "LECTURER":
          userIds = await getAllLecturerUserIds();
          break;
        case "ADMIN": {
          const admins = await prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
            select: { id: true },
          });
          userIds = admins.map((u) => u.id);
          break;
        }
        case "ALL":
          userIds = await getAllActiveUserIds(["GUEST"]);
          break;
        default:
          return res.status(400).json({ message: "Invalid targetRole. Use STUDENT, LECTURER, ADMIN, or ALL." });
      }
    } else {
      return res.status(400).json({ message: "Provide either userId or targetRole." });
    }

    if (!userIds.length) {
      return res.json({ ok: true, sent: 0, message: "No eligible recipients found." });
    }

    await notifyUsers(userIds, { type, title, body, entityType, entityId });

    res.json({ ok: true, sent: userIds.length });
  } catch (err) {
    console.error("[notifications] sendNotification", err);
    res.status(500).json({ message: "Failed to send notification." });
  }
};
