import { Router } from "express";
import {
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from "../controllers/announcement.controller.js";

import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/", getAnnouncements);
router.get("/:id", getAnnouncement);

router.post("/", requireAdmin, createAnnouncement);
router.patch("/:id", requireAdmin, updateAnnouncement);
router.delete("/:id", requireAdmin, deleteAnnouncement);

export default router;
