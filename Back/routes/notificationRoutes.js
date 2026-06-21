import { Router } from "express";
import {
  listNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  registerDeviceToken,
  removeDeviceToken,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

// Device token management for FCM push
router.post("/device-token", registerDeviceToken);
router.delete("/device-token", removeDeviceToken);

export default router;
