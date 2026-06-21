import prisma from "../prisma/prismaClient.js";

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
