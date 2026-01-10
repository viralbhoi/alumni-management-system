import { Router } from "express";
import {
    createRequest,
    incomingRequests,
    outgoingRequests,
    updateRequest,
} from "../controllers/mentorship.controller.js";
import { requireVerified } from "../middlewares/verified.js";

const router = Router();

router.post("/requests", requireVerified, createRequest);
router.get("/requests/incoming", requireVerified, incomingRequests);
router.get("/requests/outgoing", requireVerified, outgoingRequests);
router.patch("/requests/:id", requireVerified, updateRequest);

export default router;
