import { Router } from "express";
import {
    listEducation,
    addEducation,
    updateEducation,
    deleteEducation,
} from "../controllers/education.controller.js";
import { requireVerified } from "../middlewares/verified.js";

const router = Router();

router.get("/", requireVerified, listEducation);
router.post("/", requireVerified, addEducation);
router.put("/:id", requireVerified, updateEducation);
router.delete("/:id", requireVerified, deleteEducation);

export default router;
