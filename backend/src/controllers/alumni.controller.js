import pool from "../db.js";

/**
 * POST /api/alumni
 * Register alumni (PENDING)
 */
export async function registerAlumni(req, res) {
    const { roll_no, full_name, graduation_year } = req.body;

    if (!roll_no || !full_name || !graduation_year) {
        return res.status(400).json({
            error: "roll_no, full_name, graduation_year are required",
        });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO alumni (roll_no, full_name, graduation_year)
            VALUES ($1, $2, $3)
            RETURNING id, verification_status
            `,
            [roll_no.trim(), full_name.trim(), graduation_year],
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({
                error: "Alumni already exists with same roll number",
            });
        }

        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * GET /api/alumni/me
 * Get logged-in alumni identity
 */
export async function getMyAlumni(req, res) {
    const alumniId = req.user.alumni_id;

    try {
        const result = await pool.query(
            `
            SELECT id, roll_no, full_name, graduation_year, verification_status
            FROM alumni
            WHERE id = $1
            `,
            [alumniId],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Alumni not found" });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * PATCH /api/admin/alumni/:id/verification
 * Admin verifies or rejects alumni
 */
export async function verifyAlumni(req, res) {
    const alumniId = req.params.id;
    const { status } = req.body;

    if (!["VERIFIED", "REJECTED"].includes(status)) {
        return res.status(400).json({
            error: "status must be VERIFIED or REJECTED",
        });
    }

    try {
        const result = await pool.query(
            `
            UPDATE alumni
            SET verification_status = $1
            WHERE id = $2
            RETURNING id, verification_status
            `,
            [status, alumniId],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Alumni not found" });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * GET /api/alumni/search
 * Discover + search alumni
 */
export async function searchAlumni(req, res) {
    let {
        name,
        industry,
        field,
        year_from,
        year_to,
        page = 1,
        limit = 50,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;

    const offset = (page - 1) * limit;

    let conditions = [];
    let values = [];
    let idx = 1;

    // Always enforce visibility rules
    conditions.push(`a.role = 'ALUMNI'`);
    conditions.push(`a.verification_status = 'VERIFIED'`);

    if (name) {
        conditions.push(`a.full_name ILIKE $${idx++}`);
        values.push(`%${name}%`);
    }

    if (industry) {
        conditions.push(`p.primary_industry ILIKE $${idx++}`);
        values.push(`%${industry}%`);
    }

    if (field) {
        conditions.push(`e.field_of_study ILIKE $${idx++}`);
        values.push(`%${field}%`);
    }

    if (year_from) {
        conditions.push(`a.graduation_year >= $${idx++}`);
        values.push(year_from);
    }

    if (year_to) {
        conditions.push(`a.graduation_year <= $${idx++}`);
        values.push(year_to);
    }

    const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    try {
        const result = await pool.query(
            `
            SELECT DISTINCT
                a.id,
                a.full_name,
                a.graduation_year,
                p.headline,
                p.current_company,
                p.primary_industry
            FROM alumni a
            LEFT JOIN alumni_profile p
                ON a.id = p.alumni_id
            LEFT JOIN alumni_education e
                ON a.id = e.alumni_id
            ${whereClause}
            ORDER BY a.graduation_year DESC, a.full_name ASC
            LIMIT $${idx++} OFFSET $${idx}
            `,
            [...values, limit, offset],
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * GET /api/public/:id
 * Get public alumni profile
 */
export async function getPublicAlumni(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT
                a.id,
                a.full_name,
                a.graduation_year,
                p.headline,
                p.current_company,
                p.primary_industry,
                p.location,
                p.bio
            FROM alumni a
            LEFT JOIN alumni_profile p
                ON a.id = p.alumni_id
            WHERE a.id = $1
              AND a.role = 'ALUMNI'
              AND a.verification_status = 'VERIFIED'
            `,
            [id],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * GET /api/alumni/years
 * Used for discover filters
 */
export async function getAlumniByYear(req, res) {
    try {
        const result = await pool.query(
            `
            SELECT graduation_year,
                   COUNT(*) AS total
            FROM alumni
            WHERE role = 'ALUMNI'
              AND verification_status = 'VERIFIED'
            GROUP BY graduation_year
            ORDER BY graduation_year DESC
            `,
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
