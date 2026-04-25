import { Router } from "express";
import { listAnnouncements, listDepartments, listNews } from "../controllers/guestController.js";

const router = Router();

router.get("/departments", listDepartments);
router.get("/announcements", listAnnouncements);
router.get("/news", listNews);

export default router;
