import { Router } from "express";
import {
  assignStudentToClassAsHead,
  createAnnouncement,
  createAssignment,
  gradeStudent,
  listMyAssignments,
  listMyClasses,
} from "../controllers/lecturerController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/rbacMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(requireAuth, requireRoles("LECTURER"));
router.get("/classes", listMyClasses);
router.get("/assignments", listMyAssignments);
router.post("/assignments", upload.single("file"), createAssignment);
router.post("/announcements", upload.single("file"), createAnnouncement);
router.post("/grades", gradeStudent);
router.post("/assign-student", assignStudentToClassAsHead);

export default router;
