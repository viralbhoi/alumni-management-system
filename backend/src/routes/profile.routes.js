import { Router } from "express";
import {
    getProfile,
    upsertProfile,
} from "../controllers/profile.controller.js";
import { requireVerified } from "../middlewares/verified.js";

const router = Router();

router.get("/", requireVerified, getProfile);
router.put("/", requireVerified, upsertProfile);

export default router;
