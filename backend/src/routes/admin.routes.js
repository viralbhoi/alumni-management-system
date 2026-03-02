import { Router } from "express";
import pool from "../db.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Get all pending alumni
router.get("/pending", requireAdmin, async (req, res) => {
    const result = await pool.query(
        `SELECT id, full_name, email, graduation_year
     FROM alumni
     WHERE verification_status = 'PENDING'
     ORDER BY id DESC`,
    );

    res.json(result.rows);
});

// Approve alumni
router.patch("/verify/:id", requireAdmin, async (req, res) => {
    await pool.query(
        `UPDATE alumni
     SET verification_status = 'VERIFIED'
     WHERE id = $1`,
        [req.params.id],
    );

    res.json({ success: true });
});

export default router;
