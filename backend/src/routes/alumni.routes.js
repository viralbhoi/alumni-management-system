import { Router } from "express";
import {
    registerAlumni,
    getMyAlumni,
    searchAlumni,
    getPublicAlumni,
    getAlumniByYear,
} from "../controllers/alumni.controller.js";

import { getPublicExperience } from "../controllers/experience.controller.js";
import { getPublicEducation } from "../controllers/education.controller.js";

import { requireVerified } from "../middlewares/verified.js";

const router = Router();

// --- Static routes first ---
router.post("/", registerAlumni);
router.get("/me", getMyAlumni);
router.get("/search", requireVerified, searchAlumni);
router.get("/discover/years", requireVerified, getAlumniByYear);

export default router;
