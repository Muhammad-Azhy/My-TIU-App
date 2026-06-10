import { Router } from "express";
import {
  downloadFile,
  listMyAssignments,
  listMyClasses,
  listMyGrades,
  listMyProfile,
} from "../controllers/studentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/rbacMiddleware.js";

const router = Router();

router.use(requireAuth, requireRoles("STUDENT"));
router.get("/classes", listMyClasses);
router.get("/assignments", listMyAssignments);
router.get("/grades", listMyGrades);
router.get("/profile", listMyProfile);
router.get("/files/:fileId/download", downloadFile);

export default router;
