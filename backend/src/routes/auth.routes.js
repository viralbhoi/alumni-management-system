import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { full_name, roll_no, graduation_year, email, password } =
            req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password required" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
      INSERT INTO alumni (full_name, roll_no, graduation_year, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, 'ALUMNI')
      RETURNING id
      `,
            [full_name, roll_no, graduation_year, email, hashed],
        );

        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            `SELECT * FROM alumni WHERE email = $1`,
            [email],
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                alumni_id: user.id,
                role: user.role,
                verification_status: user.verification_status,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;
