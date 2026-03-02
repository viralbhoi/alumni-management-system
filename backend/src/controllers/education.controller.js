import pool from "../db.js";

/**
 * GET /api/alumni/education
 */
export async function listEducation(req, res) {
    const alumniId = req.user.alumni_id;

    try {
        const result = await pool.query(
            `
      SELECT id, degree_type, field_of_study, institution,
             start_year, end_year, description
      FROM alumni_education
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
 * POST /api/alumni/education
 */
export async function addEducation(req, res) {
    const alumniId = req.user.alumni_id;

    const {
        degree_type,
        field_of_study,
        institution,
        start_year,
        end_year,
        description,
    } = req.body;

    if (!degree_type || !institution || !start_year) {
        return res.status(400).json({
            error: "degree_type, institution, and start_year are required",
        });
    }

    try {
        const result = await pool.query(
            `
      INSERT INTO alumni_education (
        alumni_id, degree_type, field_of_study,
        institution, start_year, end_year, description
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
      `,
            [
                alumniId,
                degree_type,
                field_of_study ?? null,
                institution,
                start_year,
                end_year ?? null,
                description ?? null,
            ],
        );

        return res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * PUT /api/alumni/education/:id
 */
export async function updateEducation(req, res) {
    const alumniId = req.user.alumni_id;
    const educationId = req.params.id;

    const {
        degree_type,
        field_of_study,
        institution,
        start_year,
        end_year,
        description,
    } = req.body;

    if (!degree_type || !institution || !start_year) {
        return res.status(400).json({
            error: "degree_type, institution, and start_year are required",
        });
    }

    try {
        const result = await pool.query(
            `
      UPDATE alumni_education
      SET degree_type = $1,
          field_of_study = $2,
          institution = $3,
          start_year = $4,
          end_year = $5,
          description = $6,
          updated_at = now()
      WHERE id = $7 AND alumni_id = $8
      `,
            [
                degree_type,
                field_of_study ?? null,
                institution,
                start_year,
                end_year ?? null,
                description ?? null,
                educationId,
                alumniId,
            ],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Education not found" });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * DELETE /api/alumni/education/:id
 */
export async function deleteEducation(req, res) {
    const alumniId = req.user.alumni_id;
    const educationId = req.params.id;

    try {
        const result = await pool.query(
            `
      DELETE FROM alumni_education
      WHERE id = $1 AND alumni_id = $2
      `,
            [educationId, alumniId],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Education not found" });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getPublicEducation(req, res) {
    const { id } = req.params;

    const result = await pool.query(
        `
    SELECT degree_type, field_of_study,
           institution, start_year, end_year
    FROM alumni_education
    WHERE alumni_id = $1
    ORDER BY start_year DESC
    `,
        [id],
    );

    res.json(result.rows);
}
