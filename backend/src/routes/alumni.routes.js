import { Router } from "express";
import {
    registerAlumni,
    getMyAlumni,
} from "../controllers/alumni.controller.js";

const router = Router();

router.post("/", registerAlumni);
router.get("/me", getMyAlumni);

export default router;
