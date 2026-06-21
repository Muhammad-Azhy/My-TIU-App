import { Router } from "express";
import {
  assignLecturerToCourse,
  assignStudentToClass,
  createDepartment,
  createNews,
  createUser,
  deleteDepartment,
  deleteNews,
  deleteUser,
  getDashboardStats,
  listClasses,
  listDepartmentsAdmin,
  listStudents,
  listUsers,
  updateDepartment,
  updateNews,
  updateUser,
} from "../controllers/adminController.js";
import { getViewStats } from "../controllers/viewTrackingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdminOrHead } from "../middleware/rbacMiddleware.js";

const router = Router();

router.use(requireAuth, requireAdminOrHead);
router.get("/dashboard-stats", getDashboardStats);
router.get("/users", listUsers);
router.get("/students", listStudents);
router.get("/classes", listClasses);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.post("/enrollments", assignStudentToClass);
router.post("/class-lecturer", assignLecturerToCourse);

router.get("/departments", listDepartmentsAdmin);
router.post("/departments", createDepartment);
router.patch("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

router.post("/news", createNews);
router.patch("/news/:id", updateNews);
router.delete("/news/:id", deleteNews);

// View stats
router.get("/view-stats/:contentType/:contentId", getViewStats);

export default router;
