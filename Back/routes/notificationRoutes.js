import { Router } from "express";
import {
  listNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  registerDeviceToken,
  removeDeviceToken,
  sendNotification,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

// Device token management for Expo push notifications
router.post("/device-token", registerDeviceToken);
router.delete("/device-token", removeDeviceToken);

// Admin/Lecturer: send notification to user(s) or role group
router.post("/send", sendNotification);

export default router;
