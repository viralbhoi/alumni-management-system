import pool from "../db.js";

/**
 * GET /api/alumni/experience
 * List all experiences of logged-in alumni
 */
export async function listExperiences(req, res) {
    const alumniId = req.user.alumni_id;

    try {
        const result = await pool.query(
            `
      SELECT id, company, role_title, industry,
             start_year, end_year, description
      FROM alumni_experience
      WHERE alumni_id = $1
      ORDER BY start_year DESC
      `,
            [alumniId],
        );

        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * POST /api/alumni/experience
 * Add a new experience
 */
export async function addExperience(req, res) {
    const alumniId = req.user.alumni_id;

    const { company, role_title, industry, start_year, end_year, description } =
        req.body;

    // minimal validation
    if (!company || !role_title || !start_year) {
        return res.status(400).json({
            error: "company, role_title, and start_year are required",
        });
    }

    try {
        const result = await pool.query(
            `
      INSERT INTO alumni_experience (
        alumni_id, company, role_title,
        industry, start_year, end_year, description
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
      `,
            [
                alumniId,
                company,
                role_title,
                industry ?? null,
                start_year,
                end_year ?? null,
                description ?? null,
            ],
        );

        return res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        // unique constraint: only one current role
        if (err.code === "23505") {
            return res.status(400).json({
                error: "Only one current experience is allowed",
            });
        }

        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * PUT /api/alumni/experience/:id
 * Update an experience (full replace)
 */
export async function updateExperience(req, res) {
    const alumniId = req.user.alumni_id;
    const experienceId = req.params.id;

    const { company, role_title, industry, start_year, end_year, description } =
        req.body;

    if (!company || !role_title || !start_year) {
        return res.status(400).json({
            error: "company, role_title, and start_year are required",
        });
    }

    try {
        const result = await pool.query(
            `
      UPDATE alumni_experience
      SET company = $1,
          role_title = $2,
          industry = $3,
          start_year = $4,
          end_year = $5,
          description = $6,
          updated_at = now()
      WHERE id = $7 AND alumni_id = $8
      `,
            [
                company,
                role_title,
                industry ?? null,
                start_year,
                end_year ?? null,
                description ?? null,
                experienceId,
                alumniId,
            ],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Experience not found" });
        }

        return res.json({ success: true });
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({
                error: "Only one current experience is allowed",
            });
        }

        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * DELETE /api/alumni/experience/:id
 * Delete an experience
 */
export async function deleteExperience(req, res) {
    const alumniId = req.user.alumni_id;
    const experienceId = req.params.id;

    try {
        const result = await pool.query(
            `
      DELETE FROM alumni_experience
      WHERE id = $1 AND alumni_id = $2
      `,
            [experienceId, alumniId],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Experience not found" });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getPublicExperience(req, res) {
    const { id } = req.params;

    const result = await pool.query(
        `
    SELECT company, role_title, industry,
           start_year, end_year, description
    FROM alumni_experience
    WHERE alumni_id = $1
    ORDER BY start_year DESC
    `,
        [id],
    );

    res.json(result.rows);
}
