import { Router } from "express";
import { verifyAlumni } from "../controllers/alumni.controller.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.patch("/alumni/:id/verification", requireAdmin, verifyAlumni);

export default router;
