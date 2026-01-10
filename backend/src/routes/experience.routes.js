import { Router } from "express";
import {
    listExperiences,
    addExperience,
    updateExperience,
    deleteExperience
} from "../controllers/experience.controller.js";
import { requireVerified } from "../middlewares/verified.js";

const router = Router();

router.get("/", requireVerified, listExperiences);
router.post("/", requireVerified, addExperience);
router.put("/:id", requireVerified, updateExperience);
router.delete("/:id", requireVerified, deleteExperience);


export default router;
