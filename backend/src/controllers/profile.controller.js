import pool from "../db.js";

/**
 * GET /api/alumni/profile
 */
export async function getProfile(req, res) {
    const alumniId = req.user.alumni_id;

    try {
        const result = await pool.query(
            `
      SELECT headline, current_company, role_title,
             primary_industry, location, bio
      FROM alumni_profile
      WHERE alumni_id = $1
      `,
            [alumniId],
        );

        if (result.rows.length === 0) {
            return res.json({});
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * PUT /api/alumni/profile
 */
export async function upsertProfile(req, res) {
    const alumniId = req.user.alumni_id;

    const {
        headline,
        current_company,
        role_title,
        primary_industry,
        location,
        bio,
    } = req.body;

    try {
        await pool.query(
            `
      INSERT INTO alumni_profile (
        alumni_id, headline, current_company,
        role_title, primary_industry, location, bio
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (alumni_id)
      DO UPDATE SET
        headline = EXCLUDED.headline,
        current_company = EXCLUDED.current_company,
        role_title = EXCLUDED.role_title,
        primary_industry = EXCLUDED.primary_industry,
        location = EXCLUDED.location,
        bio = EXCLUDED.bio,
        updated_at = now()
      `,
            [
                alumniId,
                headline ?? null,
                current_company ?? null,
                role_title ?? null,
                primary_industry ?? null,
                location ?? null,
                bio ?? null,
            ],
        );

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateEducation(req, res) {
    const { id } = req.params;
    const alumniId = req.user.alumni_id;

    const { institution, degree, field_of_study, start_year, end_year } =
        req.body;

    try {
        const result = await pool.query(
            `
      UPDATE education
      SET institution = $1,
          degree = $2,
          field_of_study = $3,
          start_year = $4,
          end_year = $5
      WHERE id = $6 AND alumni_id = $7
      RETURNING *
      `,
            [
                institution,
                degree,
                field_of_study,
                start_year,
                end_year,
                id,
                alumniId,
            ],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Education not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}
