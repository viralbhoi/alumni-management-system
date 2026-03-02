import { Router } from "express";
import pool from "../db.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public / alumni view
router.get("/", async (req, res) => {
    const result = await pool.query(
        `SELECT id, title, content, created_at, is_pinned
     FROM announcements
     WHERE is_public = TRUE
     ORDER BY is_pinned DESC, created_at DESC`,
    );

    res.json(result.rows);
});

// Admin create
router.post("/", requireAdmin, async (req, res) => {
    const { title, content, is_pinned } = req.body;

    await pool.query(
        `INSERT INTO announcements (title, content, created_by, is_pinned)
     VALUES ($1, $2, $3, $4)`,
        [title, content, req.user.id, is_pinned || false],
    );

    res.status(201).json({ success: true });
});

export default router;
