import { Router } from "express";
import { requireVerified } from "../middlewares/verified.js";
import { getPublicAlumni } from "../controllers/alumni.controller.js";
import { getPublicExperience } from "../controllers/experience.controller.js";
import { getPublicEducation } from "../controllers/education.controller.js";

const router = Router();

router.get("/:id", requireVerified, getPublicAlumni);
router.get("/:id/experience", requireVerified, getPublicExperience);
router.get("/:id/education", requireVerified, getPublicEducation);

export default router;
